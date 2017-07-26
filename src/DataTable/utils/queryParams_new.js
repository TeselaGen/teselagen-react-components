import queryString from "query-string";
import QueryBuilder from "tg-client-query-builder";
import last from "lodash/last";
import camelCase from "lodash/camelCase";

export default function queryParams({ schema, defaults = {}, isInfinite }) {
  var defaultParams = {
    pageSize: 10,
    order: "",
    searchTerm: "", //undefined helps us compare when this has been changed to an empty string
    page: 1,
    selectedFilter: undefined,
    camelCaseDisplayName: undefined,
    filterValue: undefined,
    ...defaults
  };

  function getCurrentParamsFromUrl(location) {
    const { search } = location;
    return jsonParseNested(queryString.parse(search));
  }
  function setCurrentParamsOnUrl(newParams, push) {
    push({
      search: `?${queryString.stringify(jsonStringifyNested(newParams))}`
    });
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
    } else {
      return qb.related(reference.target).whereAny({
        [searchField]: expression
      });
    }
  }

  function getQueryParams(currentParams) {
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
      const camelCaseDisplayName = tableQueryParams.order.replace(
        /^reverse:/gi,
        ""
      );
      const schemaForField = schema.fields.find(function(field) {
        return camelCase(field.displayName) === camelCaseDisplayName;
      });
      if (schemaForField) {
        const { path } = schemaForField;
        let reversed = camelCaseDisplayName !== tableQueryParams.order;
        const prefix = reversed ? "-" : "";
        graphqlQueryParams.sort = [prefix + (path || camelCaseDisplayName)];
      } else {
        console.error(
          "No schema for field found!",
          camelCaseDisplayName,
          schema.fields
        );
      }
    }
    // let graphqlQueryParams =
    //convert params from user readable to what our api expects
    // aka page -> pageNumber & pageSize -> pageSize
    graphqlQueryParams.pageNumber = page;
    graphqlQueryParams.pageSize = pageSize;

    const {
      searchTerm,
      selectedFilter,
      filterValue,
      camelCaseDisplayName
    } = tableQueryParams;

    // delete graphqlQueryParams.searchTerm;
    // delete graphqlQueryParams.selectedFilter;
    // delete graphqlQueryParams.filterValue;
    // delete graphqlQueryParams.camelCaseDisplayName;

    if (selectedFilter) {
      const subFilter = getSubFilter(qb, selectedFilter, filterValue);
      const { path, reference } = schema.fields.find(function(field) {
        return camelCase(field.displayName) === camelCaseDisplayName;
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
      selectedFilter,
      filterValue,
      camelCaseDisplayName,
      searchTerm
    };
  }
  function makeDataTableHandlers({ setNewParams, resetSearch }) {
    function setSearchTerm(searchTerm, currentParams) {
      let newParams = {
        ...currentParams,
        selectedFilter: undefined,
        page: 1,
        camelCaseDisplayName: undefined,
        filterValue: undefined,
        searchTerm:
          searchTerm === defaultParams.searchTerm ? undefined : searchTerm
      };
      setNewParams(newParams);
    }
    function setFilter(
      { selectedFilter, filterValue, camelCaseDisplayName },
      currentParams
    ) {
      let newParams = {
        ...currentParams,
        selectedFilter,
        camelCaseDisplayName,
        filterValue,
        searchTerm: undefined
      };
      setNewParams(newParams);
      resetSearch();
    }
    function clearFilters(currentParams) {
      setNewParams({
        ...currentParams,
        selectedFilter: undefined,
        camelCaseDisplayName: undefined,
        filterValue: undefined,
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
      setFilter,
      clearFilters,
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

function jsonStringifyNested(obj) {
  var newObj = {};
  Object.keys(obj).forEach(function(key) {
    var val = obj[key];
    if (val !== null && typeof val === "object") {
      newObj[key] = JSON.stringify(val);
    } else {
      newObj[key] = val;
    }
  });
  return newObj;
}

function jsonParseNested(obj) {
  var newObj = {};
  Object.keys(obj).forEach(function(key) {
    var val = obj[key];
    try {
      newObj[key] = JSON.parse(val);
    } catch (e) {
      newObj[key] = val;
    }
  });
  return newObj;
}

function getSubFilter(qb, selectedFilter, filterValue) {
  if (selectedFilter === "Text starts with") return qb.startsWith(filterValue);
  else if (selectedFilter === "Text ends with") return qb.endsWith(filterValue);
  else if (selectedFilter === "Text contains") return qb.contains(filterValue);
  else if (selectedFilter === "Text is exactly") return filterValue;
  else if (selectedFilter === "Date is between")
    return qb.between([filterValue[0].getTime(), filterValue[1].getTime()]);
  else if (selectedFilter === "Date is before")
    return qb.lessThan(filterValue.getTime());
  else if (selectedFilter === "Date is after")
    return qb.greaterThan(filterValue.getTime());
  else if (selectedFilter === "Greater than")
    return qb.greaterThan(filterValue);
  else if (selectedFilter === "Less than") return qb.lessThan(filterValue);
  else if (selectedFilter === "In range")
    return qb.between([filterValue[0], filterValue[1]]);
  else if (selectedFilter === "Equal to") return filterValue;
  else {
    throw new Error(
      `Unsupported filter ${selectedFilter}. Please make a new filter if you need one`
    );
  }
}
