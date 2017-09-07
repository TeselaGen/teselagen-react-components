//@flow
import queryString from "query-string";
import QueryBuilder from "tg-client-query-builder";
import last from "lodash/last";

import { uniqBy, get, clone, camelCase, startsWith, endsWith } from "lodash";

const pageSizes = [5, 10, 15, 25, 50, 100, 200];

export { pageSizes };

export function getMergedOpts(topLevel = {}, instanceLevel = {}) {
  return {
    formname: "tgDataTable",
    ...topLevel,
    ...instanceLevel,
    defaults: {
      pageSize: 10,
      order: "",
      searchTerm: "",
      page: 1,
      filters: [
        //filters look like this:
        // {
        //   selectedFilter: 'Text Contains',
        //   filterOn: ccDisplayName,
        //   filterValue: 'thomas',
        // }
      ],
      ...(topLevel.defaults || {}),
      ...(instanceLevel.defaults || {})
    }
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
function getFieldsMappedByCCDisplayName(schema) {
  return schema.fields.reduce((acc, field) => {
    acc[camelCase(field.displayName)] = field;
    return acc;
  }, {});
}

export function filterEntitiesLocal(filters, entities, schema) {
  const ccFields = getFieldsMappedByCCDisplayName(schema);
  filters.forEach(filter => {
    const { filterOn, filterValue, selectedFilter } = filter;
    console.log("filterValue:", filterValue);
    const field = ccFields[filterOn];
    const { path } = field;
    const subFilter = getSubFilter(false, selectedFilter, filterValue);
    entities = entities.filter(entity => {
      const fieldVal = get(entity, path);
      console.log("fieldVal:", fieldVal);
      const shouldKeep = subFilter(fieldVal);
      console.log("shouldKeep:", shouldKeep);
      return shouldKeep;
    });
  });
  return entities;
}

function getSubFilter(
  qb, //if no qb is passed, it means we are filtering locally and want to get a function back that can be used in an array filter
  selectedFilter,
  filterValue
) {
  if (selectedFilter === "Starts with") {
    return qb
      ? qb.startsWith(filterValue)
      : fieldVal => {
          return startsWith(fieldVal, filterValue);
        };
  } else if (selectedFilter === "Ends with") {
    return qb
      ? qb.endsWith(filterValue)
      : fieldVal => {
          return endsWith(fieldVal, filterValue);
        };
  } else if (selectedFilter === "Contains") {
    return qb
      ? qb.contains(filterValue)
      : fieldVal => {
          return fieldVal.replace(filterValue, "") !== fieldVal;
        };
  } else if (selectedFilter === "Is exactly") {
    return qb
      ? filterValue
      : fieldVal => {
          return fieldVal === filterValue;
        };
  } else if (selectedFilter === "True") {
    return qb
      ? qb.equals(true)
      : fieldVal => {
          return !!fieldVal;
        };
  } else if (selectedFilter === "False") {
    return qb
      ? qb.equals(false)
      : fieldVal => {
          return !fieldVal;
        };
  } else if (selectedFilter === "Is between") {
    return qb
      ? qb.between([filterValue[0].getTime(), filterValue[1].getTime()])
      : fieldVal => {
          return filterValue[0] <= fieldVal && fieldVal <= filterValue[1];
        };
  } else if (selectedFilter === "Is before") {
    return qb
      ? qb.lessThan(filterValue.getTime())
      : fieldVal => {
          return fieldVal <= filterValue;
        };
  } else if (selectedFilter === "Is after") {
    return qb
      ? qb.greaterThan(filterValue.getTime())
      : fieldVal => {
          return fieldVal >= filterValue;
        };
  } else if (selectedFilter === "Greater than") {
    return qb
      ? qb.greaterThan(filterValue)
      : fieldVal => {
          return fieldVal >= filterValue;
        };
  } else if (selectedFilter === "Less than") {
    return qb
      ? qb.lessThan(filterValue)
      : fieldVal => {
          return fieldVal <= filterValue;
        };
  } else if (selectedFilter === "In range") {
    return qb
      ? qb.between([filterValue[0], filterValue[1]])
      : fieldVal => {
          return filterValue[0] <= fieldVal && fieldVal <= filterValue[1];
        };
  } else if (selectedFilter === "Equal to") {
    return qb
      ? filterValue
      : fieldVal => {
          return fieldVal == filterValue;
        };
  }

  throw new Error(
    `Unsupported filter ${selectedFilter}. Please make a new filter if you need one`
  );
}

export function getCurrentParamsFromUrl(location) {
  const { search } = location;
  return parseFilters(queryString.parse(search));
}
export function setCurrentParamsOnUrl(newParams, push) {
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

export function makeDataTableHandlers({
  setNewParams,
  resetSearch,
  defaults,
  onlyOneFilter
}) {
  //all of these actions have currentParams bound to them as their last arg in withTableParams
  function setSearchTerm(searchTerm, currentParams) {
    let newParams = {
      ...currentParams,
      page: undefined, //set page undefined to return the table to page 1
      searchTerm: searchTerm === defaults.searchTerm ? undefined : searchTerm
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
      page: undefined, //set page undefined to return the table to page 1
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
      pageSize: pageSize === defaults.pageSize ? undefined : pageSize,
      page: undefined //set page undefined to return the table to page 1
    };
    setNewParams(newParams);
  }
  function setOrder(order, currentParams) {
    let newParams = {
      ...currentParams,
      order: order === defaults.order ? undefined : order
    };
    setNewParams(newParams);
  }
  function setPage(page, currentParams) {
    let newParams = {
      ...currentParams,
      page: page === defaults.page ? undefined : page
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

export function getQueryParams({
  currentParams,
  urlConnected,
  defaults,
  schema,
  isInfinite
}) {
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
    ...defaults,
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
  if (page <= 0 || isNaN(page)) {
    page = undefined;
  }
  if (isInfinite) {
    graphqlQueryParams.pageSize = 999;
    graphqlQueryParams.pageNumber = 1;
    page = undefined;
    pageSize = undefined;
  }

  if (pageSize !== undefined) {
    //pageSize might come in as an unexpected number so we coerce it to be one of the nums in our pageSizes array
    let closest = clone(pageSizes).sort(
      (a, b) => Math.abs(pageSize - a) - Math.abs(pageSize - b)
    )[0];
    pageSize = closest;
  }

  // let graphqlQueryParams =
  //convert params from user readable to what our api expects
  // aka page -> pageNumber & pageSize -> pageSize
  graphqlQueryParams.pageNumber = page;
  graphqlQueryParams.pageSize = pageSize;
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
