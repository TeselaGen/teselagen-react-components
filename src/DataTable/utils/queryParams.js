//@flow
import queryString from "query-string";
import QueryBuilder from "tg-client-query-builder";
import moment from "moment";

import {
  uniqBy,
  uniq,
  get,
  clone,
  camelCase,
  startsWith,
  endsWith,
  last,
  orderBy,
  take,
  drop
} from "lodash";

const pageSizes = [5, 10, 15, 25, 50, 100, 200];

export { pageSizes };

export function getMergedOpts(topLevel = {}, instanceLevel = {}) {
  return {
    formName: "tgDataTable",
    ...topLevel,
    ...instanceLevel,
    defaults: {
      pageSize: 25,
      order: [], //[-name, statusCode] //an array of camelCase display names with - sign to denote reverse
      searchTerm: "",
      page: 1,
      filters: [
        //filters look like this:
        // {
        //   selectedFilter: 'textContains', //camel case
        //   filterOn: ccDisplayName, //camel case display name
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
    acc[camelCase(field.displayName || field.path)] = field;
    return acc;
  }, {});
}

function orderEntitiesLocal(orderArray, entities, schema) {
  if (orderArray && orderArray.length) {
    let orderFuncs = [];
    let ascOrDescArray = [];
    orderArray.forEach(order => {
      const ccDisplayName = order.replace(/^-/gi, "");
      const ccFields = getFieldsMappedByCCDisplayName(schema);
      const field = ccFields[ccDisplayName];
      if (!field) {
        throw new Error(
          "Ruh roh, there should have been a column to sort on for " +
            order +
            "but none was found in " +
            schema.fields
        );
      }
      const { path, getValueToFilterOn, sortFn } = field;
      ascOrDescArray.push(ccDisplayName === order ? "asc" : "desc");
      //push the actual sorting function
      if (path && endsWith(path.toLowerCase(), "id")) {
        orderFuncs.push(o => {
          return parseInt(get(o, path), 10);
        });
      } else if (sortFn) {
        const toOrder = Array.isArray(sortFn) ? sortFn : [sortFn];
        orderFuncs.push(...toOrder);
      } else if (getValueToFilterOn) {
        orderFuncs.push(o => {
          return getValueToFilterOn(o);
        });
      } else {
        orderFuncs.push(path);
      }
    });
    entities = orderBy(entities, orderFuncs, ascOrDescArray);
  }
  return entities;
}

function getAndAndOrFilters(allFilters) {
  const orFilters = [];
  const andFilters = [];
  allFilters.forEach(filter => {
    if (filter.isOrFilter) {
      orFilters.push(filter);
    } else {
      andFilters.push(filter);
    }
  });
  return {
    orFilters,
    andFilters
  };
}

function filterEntitiesLocal(filters = [], searchTerm, entities, schema) {
  const allFilters = getAllFilters(filters, searchTerm, schema);
  if (allFilters.length) {
    const ccFields = getFieldsMappedByCCDisplayName(schema);
    const { andFilters, orFilters } = getAndAndOrFilters(allFilters);
    //filter ands first
    andFilters.forEach(filter => {
      entities = getEntitiesForGivenFilter(entities, filter, ccFields);
    });
    //then filter ors
    if (orFilters.length) {
      let orEntities = [];
      orFilters.forEach(filter => {
        orEntities = orEntities.concat(
          getEntitiesForGivenFilter(entities, filter, ccFields)
        );
      });
      entities = uniq(orEntities);
    }
  }
  return entities;
}

function getEntitiesForGivenFilter(entities, filter, ccFields) {
  const { filterOn, filterValue, selectedFilter } = filter;
  const field = ccFields[filterOn];
  const { path, getValueToFilterOn } = field;
  const subFilter = getSubFilter(false, selectedFilter, filterValue);
  entities = entities.filter(entity => {
    const fieldVal = getValueToFilterOn
      ? getValueToFilterOn(entity)
      : get(entity, path);
    const shouldKeep = subFilter(fieldVal);
    return shouldKeep;
  });
  return entities;
}

function getFiltersFromSearchTerm(searchTerm, schema) {
  const searchTermFilters = [];
  if (searchTerm) {
    schema.fields.forEach(field => {
      const { type, displayName, path, searchDisabled } = field;
      if (searchDisabled || field.filterDisabled) return;
      const nameToUse = camelCase(displayName || path);
      if (type === "string" || type === "lookup") {
        searchTermFilters.push({
          filterOn: nameToUse,
          filterValue: searchTerm,
          selectedFilter: "contains",
          isOrFilter: true
        });
      } else if (type === "boolean") {
        if ("true".replace(new RegExp("^" + searchTerm, "ig"), "") !== "true") {
          searchTermFilters.push({
            filterOn: nameToUse,
            filterValue: true,
            selectedFilter: "true",
            isOrFilter: true
          });
        } else if (
          "false".replace(new RegExp("^" + searchTerm, "ig"), "") !== "false"
        ) {
          searchTermFilters.push({
            filterOn: nameToUse,
            filterValue: false,
            selectedFilter: "false",
            isOrFilter: true
          });
        }
      }
    });
  }
  return searchTermFilters;
}

function getSubFilter(
  qb, //if no qb is passed, it means we are filtering locally and want to get a function back that can be used in an array filter
  selectedFilter,
  filterValue
) {
  const ccSelectedFilter = camelCase(selectedFilter);
  const filterValLower =
    filterValue && filterValue.toLowerCase && filterValue.toLowerCase();

  if (ccSelectedFilter === "startsWith") {
    return qb
      ? qb.startsWith(filterValue) //filter using qb (aka we're backend connected)
      : fieldVal => {
          //filter using plain old javascript (aka we've got a local table that isn't backend connected)
          if (!fieldVal || !fieldVal.toLowerCase) return false;
          return startsWith(fieldVal.toLowerCase(), filterValLower);
        };
  } else if (ccSelectedFilter === "endsWith") {
    return qb
      ? qb.endsWith(filterValue) //filter using qb (aka we're backend connected)
      : fieldVal => {
          //filter using plain old javascript (aka we've got a local table that isn't backend connected)
          if (!fieldVal || !fieldVal.toLowerCase) return false;
          return endsWith(fieldVal.toLowerCase(), filterValLower);
        };
  } else if (ccSelectedFilter === "contains") {
    const filterValueToUse = filterValue.toString
      ? filterValue.toString()
      : filterValue;
    return qb
      ? qb.contains(filterValueToUse) //filter using qb (aka we're backend connected)
      : fieldVal => {
          //filter using plain old javascript (aka we've got a local table that isn't backend connected)
          if (!fieldVal || !fieldVal.toLowerCase) return false;
          return (
            fieldVal.toLowerCase().replace(filterValLower, "") !==
            fieldVal.toLowerCase()
          );
        };
  } else if (ccSelectedFilter === "inList") {
    const filterValueToUse =
      filterValue && filterValue.split && filterValue.split(".");
    return qb
      ? qb.inList(filterValueToUse) //filter using qb (aka we're backend connected)
      : fieldVal => {
          //filter using plain old javascript (aka we've got a local table that isn't backend connected)
          if (!fieldVal || !fieldVal.toLowerCase) return false;
          return (
            filterValueToUse
              .map(val => val && val.toLowerCase())
              .indexOf(fieldVal.toLowerCase()) > -1
          );
        };
  } else if (ccSelectedFilter === "isExactly") {
    return qb
      ? filterValue
      : fieldVal => {
          return fieldVal === filterValue;
        };
  } else if (ccSelectedFilter === "true") {
    return qb
      ? qb.equals(true) //filter using qb (aka we're backend connected)
      : fieldVal => {
          //filter using plain old javascript (aka we've got a local table that isn't backend connected)
          return !!fieldVal;
        };
  } else if (ccSelectedFilter === "false") {
    return qb
      ? qb.equals(false) //filter using qb (aka we're backend connected)
      : fieldVal => {
          //filter using plain old javascript (aka we've got a local table that isn't backend connected)
          return !fieldVal;
        };
  } else if (ccSelectedFilter === "isBetween") {
    const filterValueToUse =
      filterValue && filterValue.split && filterValue.split(".");
    return qb
      ? qb.between(new Date(filterValueToUse[0]), new Date(filterValueToUse[1]))
      : fieldVal => {
          return (
            moment(filterValueToUse[0]).valueOf() <=
              moment(fieldVal).valueOf() &&
            moment(fieldVal).valueOf() <= moment(filterValueToUse[1]).valueOf()
          );
        };
  } else if (ccSelectedFilter === "isBefore") {
    return qb
      ? qb.lessThan(new Date(filterValue))
      : fieldVal => {
          return moment(fieldVal).valueOf() < moment(filterValue).valueOf();
        };
  } else if (ccSelectedFilter === "isAfter") {
    return qb
      ? qb.greaterThan(new Date(filterValue))
      : fieldVal => {
          return moment(fieldVal).valueOf() > moment(filterValue).valueOf();
        };
  } else if (ccSelectedFilter === "greaterThan") {
    return qb
      ? qb.greaterThan(filterValue)
      : fieldVal => {
          return fieldVal > filterValue;
        };
  } else if (ccSelectedFilter === "lessThan") {
    return qb
      ? qb.lessThan(filterValue)
      : fieldVal => {
          return fieldVal < filterValue;
        };
  } else if (ccSelectedFilter === "inRange") {
    return qb
      ? qb.between([filterValue[0], filterValue[1]])
      : fieldVal => {
          return filterValue[0] <= fieldVal && fieldVal <= filterValue[1];
        };
  } else if (ccSelectedFilter === "equalTo") {
    return qb
      ? filterValue
      : fieldVal => {
          return fieldVal === filterValue;
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
export function setCurrentParamsOnUrl(newParams, replace) {
  const stringifiedFilters = stringifyFilters(newParams);
  replace({
    search: `?${queryString.stringify(stringifiedFilters)}`
  });
}

function stringifyFilters(newParams) {
  let filters;
  if (newParams.filters && newParams.filters.length) {
    filters = newParams.filters.reduce(
      (acc, { filterOn, selectedFilter, filterValue }, index) => {
        acc +=
          (index > 0 ? "___" : "") +
          `${filterOn}__${camelCase(selectedFilter)}__${safeStringify(
            Array.isArray(filterValue) ? filterValue.join(".") : filterValue
          )}`;
        return acc;
      },
      ""
    );
  }
  let order;
  if (newParams.order && newParams.order.length) {
    order = newParams.order.reduce((acc, order, index) => {
      acc += (index > 0 ? "___" : "") + order;
      return acc;
    }, "");
  }
  return {
    ...newParams,
    filters,
    order
  };
}
function parseFilters(newParams) {
  return {
    ...newParams,
    order: newParams.order && newParams.order.split("___"),
    filters:
      newParams.filters &&
      newParams.filters.split("___").map(filter => {
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
  function clearFilters(additionalFilterKeys = []) {
    const toClear = {
      filters: undefined,
      searchTerm: undefined,
      tags: undefined
    };
    additionalFilterKeys.forEach(key => {
      toClear[key] = undefined;
    });
    setNewParams(toClear);
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
  function setOrder(order, isRemove, shiftHeld, currentParams) {
    let newOrder = [];
    if (shiftHeld) {
      //first remove the old order
      newOrder = [...(currentParams.order || [])].filter(value => {
        const shouldRemove =
          value.replace(/^-/, "") === order.replace(/^-/, "");
        return !shouldRemove;
      });
      //then, if we are adding, pop the order onto the array
      if (!isRemove) {
        newOrder.push(order);
      }
    } else {
      if (isRemove) {
        newOrder = [];
      } else {
        newOrder = [order];
      }
    }
    let newParams = {
      ...currentParams,
      order: newOrder
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
    setOrder,
    setNewParams
  };
}

// if an inList value only has two items like
// 2.3 then it will get parsed to a number and
// break, convert it back to a string here
function cleanupFilter(filter) {
  let filterToUse = filter;
  if (
    filterToUse.selectedFilter === "inList" &&
    typeof filterToUse.filterValue === "number"
  ) {
    filterToUse = {
      ...filterToUse,
      filterValue: filterToUse.filterValue.toString()
    };
  }
  if (filterToUse.selectedFilter === "inList") {
    filterToUse = {
      ...filterToUse,
      filterValue: filterToUse.filterValue.replace(/, |,/g, ".")
    };
  }
  return filterToUse;
}

function getAllFilters(filters, searchTerm, schema) {
  let allFilters = [
    ...filters,
    ...getFiltersFromSearchTerm(searchTerm, schema)
  ];

  allFilters = allFilters.filter(val => {
    return val !== "";
  }); //get rid of erroneous filters

  return allFilters.map(cleanupFilter);
}

export function getQueryParams({
  currentParams,
  urlConnected,
  defaults,
  schema,
  isInfinite,
  entities,
  isLocalCall,
  additionalFilter
}) {
  Object.keys(currentParams).forEach(function(key) {
    if (currentParams[key] === undefined) {
      delete currentParams[key]; //we want to use the default value if any of these are undefined
    }
  });
  let tableQueryParams = {
    ...defaults,
    ...currentParams
  };
  let { page, pageSize, searchTerm, filters, order } = tableQueryParams;
  if (page <= 0 || isNaN(page)) {
    page = undefined;
  }
  if (isInfinite) {
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
  const toReturn = {
    //these are values that might be generally useful for the wrapped component
    page,
    pageSize,
    order,
    filters,
    searchTerm
  };

  if (isLocalCall) {
    let newEntities = entities;
    //if the table is local (aka not directly connected to a db) then we need to
    //handle filtering/paging/sorting all on the front end
    newEntities = filterEntitiesLocal(filters, searchTerm, newEntities, schema);
    newEntities = orderEntitiesLocal(order, newEntities, schema);

    let newEntityCount = newEntities.length;
    //calculate the sorted, filtered, paged entities for the local table

    if (!isInfinite) {
      const offset = (page - 1) * pageSize;
      newEntities = take(drop(newEntities, offset), pageSize);
    }
    toReturn.entities = newEntities;
    toReturn.entityCount = newEntityCount;
    //if this call is being made by a local-data only connected datatable component,
    //we don't want to do the following gql stuff
    return toReturn;
  } else {
    const graphqlQueryParams = {
      // need to make sure sort exists because of https://github.com/apollographql/apollo-client/issues/3077
      sort: []
    };
    if (isInfinite) {
      graphqlQueryParams.pageSize = 999;
      graphqlQueryParams.pageNumber = 1;
    } else {
      graphqlQueryParams.pageNumber = page;
      graphqlQueryParams.pageSize = pageSize;
    }

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

    const ccFields = getFieldsMappedByCCDisplayName(schema);

    if (tableQueryParams.order && tableQueryParams.order.length) {
      tableQueryParams.order.forEach(orderVal => {
        const ccDisplayName = orderVal.replace(/^-/gi, "");
        const schemaForField = ccFields[ccDisplayName];
        if (schemaForField) {
          const { path } = schemaForField;
          let reversed = ccDisplayName !== orderVal;
          const prefix = reversed ? "-" : "";
          graphqlQueryParams.sort = [
            ...(graphqlQueryParams.sort || []),
            prefix + path
          ];
        } else {
          console.error(
            "No schema for field found!",
            ccDisplayName,
            schema.fields
          );
        }
      });
    }

    let errorParsingUrlString;
    const allFilters = getAllFilters(filters, searchTerm, schema);
    const { andFilters, orFilters } = getAndAndOrFilters(allFilters);
    const additionalFilterToUse = additionalFilter(qb, currentParams);
    try {
      qb
        .whereAll(getQueries(andFilters, qb, ccFields))
        .andWhereAll(additionalFilterToUse)
        .andWhereAny(getQueries(orFilters, qb, ccFields));
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

    graphqlQueryParams.filter = qb.toJSON();
    return {
      ...toReturn,
      //the query params will get passed directly to as variables to the graphql query
      variables: graphqlQueryParams,
      errorParsingUrlString
    };
  }
}

function getQueries(filters, qb, ccFields) {
  const subQueries = filters.reduce((acc, filter) => {
    if (!filter) {
      console.warn("We should always have a filter object!");
      return acc;
    }
    const { selectedFilter, filterValue, filterOn } = filter;
    const subFilter = getSubFilter(qb, selectedFilter, filterValue);
    const fieldSchema = ccFields[filterOn];
    if (fieldSchema) {
      const { path, reference } = fieldSchema;
      if (reference) {
        acc[reference.sourceField] = buildRef(
          qb,
          reference,
          last(path.split(".")),
          subFilter
        );
      } else {
        acc[path] = subFilter;
      }
    } else if (filterOn === "id") {
      acc[filterOn] = subFilter;
    } else {
      console.error("Trying to filter on unknown field");
    }
    return acc;
  }, {});
  return subQueries;
}
