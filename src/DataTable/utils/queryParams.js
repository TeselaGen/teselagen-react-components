//@flow
import queryString from "query-string";
import QueryBuilder from "tg-client-query-builder";
import last from "lodash/last";
import uniqBy from "lodash/uniqBy";
import camelCase from "lodash/camelCase";

export default function queryParams({
  schema,
  defaults = {},
  isInfinite,
  onlyOneFilter
}) {
  let defaultParams = {
    pageSize: 10,
    order: "",
    searchTerm: "",
    page: 1,
    filters: [
      //filters look like this:
      // {
      //   selectedFilter: undefined,
      //   filterOn: undefined,
      //   filterValue: undefined,
      // }
    ],
    ...defaults
  };

  function getCurrentParamsFromUrl(location) {
    const { search } = location;
    return parseFilters(queryString.parse(search));
  }
  function setCurrentParamsOnUrl(newParams, push) {
    const stringifiedFilters = stringifyFilters(newParams);
    push({
      search: `?${queryString.stringify(stringifiedFilters)}`
    });
  }

  function stringifyFilters(newParams) {
    let filters = [];
    if (newParams.filters && newParams.filters.length) {
      filters = newParams.filters.reduce(
        (acc, { filterOn, selectedFilter, filterValue }, index) => {
          acc +=
            (index > 0 ? "&&" : "") +
            `${filterOn}__${selectedFilter}__${safeStringify(filterValue)}`;
          return acc;
        },
        ""
      );
    }
    return {
      ...newParams,
      filters
    };
  }
  function parseFilters(newParams) {
    return {
      ...newParams,
      filters:
        newParams.filters &&
        newParams.filters.split("&&").map(filter => {
          const splitFilter = filter.split("__");
          return {
            filterOn: splitFilter[0],
            selectedFilter: splitFilter[1],
            filterValue: safeParse(splitFilter[2])
          };
        })
    };
  }

  function buildRef(qb, reference, searchField, expression) {
    if (reference.reference) {
      // qb[reference.target] = {}
      return qb.related(reference.target).whereAny({
        [reference.sourceField]: buildRef(
          qb,
          reference.reference,
          searchField,
          expression
        )
      });
    }
    return qb.related(reference.target).whereAny({
      [searchField]: expression
    });
  }

  function getQueryParams(currentParams, urlConnected) {
    const { model } = schema;
    let qb = new QueryBuilder(model);
    // qb = qb.filter('user')
    // qb = qb.whereAny({
    //   userStatus: qb.related('userStatus').whereAny({
    //     code: qb.contains('pending')
    //   })
    // })
    // qb = qb.andWhere({
    //   age: qb.lessThan(12)
    // })
    // qb.toJSON()
    // let filterBuilder = qb.filter(model); //start filter on model

    Object.keys(currentParams).forEach(function(key) {
      if (currentParams[key] === undefined) {
        delete currentParams[key]; //we want to use the default value if any of these are undefined
      }
    });
    let tableQueryParams = {
      ...defaultParams,
      ...currentParams
    };

    let graphqlQueryParams = {};
    let { page, pageSize } = tableQueryParams;
    if (tableQueryParams.order) {
      const orderOn = tableQueryParams.order.replace(/^reverse:/gi, "");
      const schemaForField = schema.fields.find(function(field) {
        return camelCase(field.displayName) === orderOn;
      });
      if (schemaForField) {
        const { path } = schemaForField;
        let reversed = orderOn !== tableQueryParams.order;
        const prefix = reversed ? "-" : "";
        graphqlQueryParams.sort = [prefix + (path || orderOn)];
      } else {
        console.error("No schema for field found!", orderOn, schema.fields);
      }
    }
    // let graphqlQueryParams =
    //convert params from user readable to what our api expects
    // aka page -> pageNumber & pageSize -> pageSize
    graphqlQueryParams.pageNumber = page;
    graphqlQueryParams.pageSize = pageSize;

    const { searchTerm, filters } = tableQueryParams;
    let errorParsingUrlString;

    if (filters.length) {
      filters.forEach(filter => {
        if (!filter) {
          console.warn("We should always have a filter object!");
          return;
        }
        const { selectedFilter, filterValue, filterOn } = filter;
        try {
          const subFilter = getSubFilter(qb, selectedFilter, filterValue);
          const { path, reference } = schema.fields.find(function(field) {
            return camelCase(field.displayName) === filterOn;
          });
          if (reference) {
            qb.whereAny({
              [reference.sourceField]: buildRef(
                qb,
                reference,
                last(path.split(".")),
                subFilter
              )
            });
          } else {
            qb.whereAny({
              [path]: subFilter
            });
          }
        } catch (e) {
          if (urlConnected) {
            errorParsingUrlString = e;
            console.error(
              "The following error occurred when trying to build the query params. This is probably due to a malformed URL:",
              e
            );
          } else {
            console.error("Error building query params from filter:");
            throw e;
          }
        }
      });
    }

    if (searchTerm && searchTerm !== "") {
      //custom logic based on the table schema to get the sequelize query
      let searchTermFilters = [];
      schema.fields.forEach(function(schemaField) {
        const { reference, type, path } = schemaField;
        if (type === "string" || type === "lookup") {
          if (reference) {
            searchTermFilters.push({
              [reference.sourceField]: buildRef(
                qb,
                reference,
                last(path.split(".")),
                qb.contains(searchTerm)
              )
            });
          } else {
            searchTermFilters.push({
              [path]: qb.contains(searchTerm)
            });
          }
        }
      });
      qb.orWhereAny(...searchTermFilters);
    }
    graphqlQueryParams.filter = qb.toJSON();
    if (isInfinite) {
      graphqlQueryParams.pageSize = 999;
      graphqlQueryParams.pageNumber = 1;
      page = undefined;
      pageSize = undefined;
    }
    return {
      //the query params get passed directly to graphql
      queryParams: graphqlQueryParams,
      //these are values that might be generally useful for the wrapped component
      page,
      pageSize,
      order: graphqlQueryParams.sort,
      filters,
      errorParsingUrlString,
      searchTerm
    };
  }
  function makeDataTableHandlers({ setNewParams, resetSearch }) {
    //all of these actions have currentParams bound to them as their last arg in withTableParams
    function setSearchTerm(searchTerm, currentParams) {
      let newParams = {
        ...currentParams,
        page: 1,
        searchTerm:
          searchTerm === defaultParams.searchTerm ? undefined : searchTerm
      };
      setNewParams(newParams);
      onlyOneFilter && clearFilters();
    }
    function addFilters(newFilters, currentParams) {
      if (!newFilters) return;
      const filters = uniqBy(
        [...newFilters, ...(onlyOneFilter ? [] : currentParams.filters || [])],
        "filterOn"
      );

      let newParams = {
        ...currentParams,
        filters
      };
      setNewParams(newParams);
      onlyOneFilter && resetSearch();
    }
    function removeSingleFilter(filterOn, currentParams) {
      const filters = currentParams.filters
        ? currentParams.filters.filter(filter => {
            return filter.filterOn !== filterOn;
          })
        : undefined;
      let newParams = {
        ...currentParams,
        filters
      };
      setNewParams(newParams);
    }
    function clearFilters(currentParams) {
      setNewParams({
        ...currentParams,
        filters: undefined,
        searchTerm: undefined
      });
      resetSearch();
    }
    function setPageSize(pageSize, currentParams) {
      let newParams = {
        ...currentParams,
        pageSize: pageSize === defaultParams.pageSize ? undefined : pageSize,
        page: 1
      };
      setNewParams(newParams);
    }
    function setOrder(order, currentParams) {
      let newParams = {
        ...currentParams,
        order: order === defaultParams.order ? undefined : order
      };
      setNewParams(newParams);
    }
    function setPage(page, currentParams) {
      let newParams = {
        ...currentParams,
        page: page === defaultParams.page ? undefined : page
      };
      setNewParams(newParams);
    }
    return {
      setSearchTerm,
      addFilters,
      clearFilters,
      removeSingleFilter,
      setPageSize,
      setPage,
      setOrder
    };
  }

  return {
    getQueryParams,
    setCurrentParamsOnUrl,
    getCurrentParamsFromUrl,
    makeDataTableHandlers
  };
}

function safeStringify(val) {
  if (val !== null && typeof val === "object") {
    return JSON.stringify(val);
  }
  return val;
}

function safeParse(val) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}

function getSubFilter(qb, selectedFilter, filterValue) {
  if (selectedFilter === "Starts with") return qb.startsWith(filterValue);
  else if (selectedFilter === "Ends with") return qb.endsWith(filterValue);
  else if (selectedFilter === "Contains") return qb.contains(filterValue);
  else if (selectedFilter === "Is exactly") return filterValue;
  else if (selectedFilter === "Is between")
    return qb.between([filterValue[0].getTime(), filterValue[1].getTime()]);
  else if (selectedFilter === "Is before")
    return qb.lessThan(filterValue.getTime());
  else if (selectedFilter === "Is after")
    return qb.greaterThan(filterValue.getTime());
  else if (selectedFilter === "Greater than")
    return qb.greaterThan(filterValue);
  else if (selectedFilter === "Less than") return qb.lessThan(filterValue);
  else if (selectedFilter === "In range")
    return qb.between([filterValue[0], filterValue[1]]);
  else if (selectedFilter === "Equal to") return filterValue;

  throw new Error(
    `Unsupported filter ${selectedFilter}. Please make a new filter if you need one`
  );
}
