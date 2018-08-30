var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import queryString from "query-string";
import QueryBuilder from "tg-client-query-builder";
import moment from "moment";

import { uniqBy, uniq, get, clone, camelCase, startsWith, endsWith, last, orderBy, take, drop } from "lodash";

var pageSizes = [5, 10, 15, 25, 50, 100, 200];

export { pageSizes };

export function getMergedOpts() {
  var topLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var instanceLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return _extends({
    formName: "tgDataTable"
  }, topLevel, instanceLevel, {
    defaults: _extends({
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
      ]
    }, topLevel.defaults || {}, instanceLevel.defaults || {})
  });
}

function safeStringify(val) {
  if (val !== null && (typeof val === "undefined" ? "undefined" : _typeof(val)) === "object") {
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
  return schema.fields.reduce(function (acc, field) {
    acc[camelCase(field.displayName || field.path)] = field;
    return acc;
  }, {});
}

function orderEntitiesLocal(orderArray, entities, schema) {
  if (orderArray && orderArray.length) {
    var orderFuncs = [];
    var ascOrDescArray = [];
    orderArray.forEach(function (order) {
      var ccDisplayName = order.replace(/^-/gi, "");
      var ccFields = getFieldsMappedByCCDisplayName(schema);
      var field = ccFields[ccDisplayName];
      if (!field) {
        throw new Error("Ruh roh, there should have been a column to sort on for " + order + "but none was found in " + schema.fields);
      }
      var path = field.path,
          getValueToFilterOn = field.getValueToFilterOn,
          sortFn = field.sortFn;

      ascOrDescArray.push(ccDisplayName === order ? "asc" : "desc");
      //push the actual sorting function
      if (path && endsWith(path.toLowerCase(), "id")) {
        orderFuncs.push(function (o) {
          return parseInt(get(o, path), 10);
        });
      } else if (sortFn) {
        var toOrder = Array.isArray(sortFn) ? sortFn : [sortFn];
        orderFuncs.push.apply(orderFuncs, toOrder);
      } else if (getValueToFilterOn) {
        orderFuncs.push(function (o) {
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
  var orFilters = [];
  var andFilters = [];
  allFilters.forEach(function (filter) {
    if (filter.isOrFilter) {
      orFilters.push(filter);
    } else {
      andFilters.push(filter);
    }
  });
  return {
    orFilters: orFilters,
    andFilters: andFilters
  };
}

function filterEntitiesLocal() {
  var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var searchTerm = arguments[1];
  var entities = arguments[2];
  var schema = arguments[3];

  var allFilters = getAllFilters(filters, searchTerm, schema);
  if (allFilters.length) {
    var ccFields = getFieldsMappedByCCDisplayName(schema);

    var _getAndAndOrFilters = getAndAndOrFilters(allFilters),
        andFilters = _getAndAndOrFilters.andFilters,
        orFilters = _getAndAndOrFilters.orFilters;
    //filter ands first


    andFilters.forEach(function (filter) {
      entities = getEntitiesForGivenFilter(entities, filter, ccFields);
    });
    //then filter ors
    if (orFilters.length) {
      var orEntities = [];
      orFilters.forEach(function (filter) {
        orEntities = orEntities.concat(getEntitiesForGivenFilter(entities, filter, ccFields));
      });
      entities = uniq(orEntities);
    }
  }
  return entities;
}

function getEntitiesForGivenFilter(entities, filter, ccFields) {
  var filterOn = filter.filterOn,
      filterValue = filter.filterValue,
      selectedFilter = filter.selectedFilter;

  var field = ccFields[filterOn];
  var path = field.path,
      getValueToFilterOn = field.getValueToFilterOn;

  var subFilter = getSubFilter(false, selectedFilter, filterValue);
  entities = entities.filter(function (entity) {
    var fieldVal = getValueToFilterOn ? getValueToFilterOn(entity) : get(entity, path);
    var shouldKeep = subFilter(fieldVal);
    return shouldKeep;
  });
  return entities;
}

function getFiltersFromSearchTerm(searchTerm, schema) {
  var searchTermFilters = [];
  if (searchTerm) {
    schema.fields.forEach(function (field) {
      var type = field.type,
          displayName = field.displayName,
          path = field.path,
          searchDisabled = field.searchDisabled;

      if (searchDisabled || field.filterDisabled) return;
      var nameToUse = camelCase(displayName || path);
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
        } else if ("false".replace(new RegExp("^" + searchTerm, "ig"), "") !== "false") {
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

function getSubFilter(qb, //if no qb is passed, it means we are filtering locally and want to get a function back that can be used in an array filter
selectedFilter, filterValue) {
  var ccSelectedFilter = camelCase(selectedFilter);
  var filterValLower = filterValue && filterValue.toLowerCase && filterValue.toLowerCase();

  if (ccSelectedFilter === "startsWith") {
    return qb ? qb.startsWith(filterValue) //filter using qb (aka we're backend connected)
    : function (fieldVal) {
      //filter using plain old javascript (aka we've got a local table that isn't backend connected)
      if (!fieldVal || !fieldVal.toLowerCase) return false;
      return startsWith(fieldVal.toLowerCase(), filterValLower);
    };
  } else if (ccSelectedFilter === "endsWith") {
    return qb ? qb.endsWith(filterValue) //filter using qb (aka we're backend connected)
    : function (fieldVal) {
      //filter using plain old javascript (aka we've got a local table that isn't backend connected)
      if (!fieldVal || !fieldVal.toLowerCase) return false;
      return endsWith(fieldVal.toLowerCase(), filterValLower);
    };
  } else if (ccSelectedFilter === "contains") {
    var filterValueToUse = filterValue.toString ? filterValue.toString() : filterValue;
    return qb ? qb.contains(filterValueToUse) //filter using qb (aka we're backend connected)
    : function (fieldVal) {
      //filter using plain old javascript (aka we've got a local table that isn't backend connected)
      if (!fieldVal || !fieldVal.toLowerCase) return false;
      return fieldVal.toLowerCase().replace(filterValLower, "") !== fieldVal.toLowerCase();
    };
  } else if (ccSelectedFilter === "inList") {
    var _filterValueToUse = filterValue && filterValue.split && filterValue.split(".");
    return qb ? qb.inList(_filterValueToUse) //filter using qb (aka we're backend connected)
    : function (fieldVal) {
      //filter using plain old javascript (aka we've got a local table that isn't backend connected)
      if (!fieldVal || !fieldVal.toLowerCase) return false;
      return _filterValueToUse.map(function (val) {
        return val && val.toLowerCase();
      }).indexOf(fieldVal.toLowerCase()) > -1;
    };
  } else if (ccSelectedFilter === "isExactly") {
    return qb ? filterValue : function (fieldVal) {
      return fieldVal === filterValue;
    };
  } else if (ccSelectedFilter === "true") {
    return qb ? qb.equals(true) //filter using qb (aka we're backend connected)
    : function (fieldVal) {
      //filter using plain old javascript (aka we've got a local table that isn't backend connected)
      return !!fieldVal;
    };
  } else if (ccSelectedFilter === "false") {
    return qb ? qb.equals(false) //filter using qb (aka we're backend connected)
    : function (fieldVal) {
      //filter using plain old javascript (aka we've got a local table that isn't backend connected)
      return !fieldVal;
    };
  } else if (ccSelectedFilter === "isBetween") {
    var _filterValueToUse2 = filterValue && filterValue.split && filterValue.split(".");
    return qb ? qb.between(new Date(_filterValueToUse2[0]), new Date(_filterValueToUse2[1])) : function (fieldVal) {
      return moment(_filterValueToUse2[0]).valueOf() <= moment(fieldVal).valueOf() && moment(fieldVal).valueOf() <= moment(_filterValueToUse2[1]).valueOf();
    };
  } else if (ccSelectedFilter === "isBefore") {
    return qb ? qb.lessThan(new Date(filterValue)) : function (fieldVal) {
      return moment(fieldVal).valueOf() < moment(filterValue).valueOf();
    };
  } else if (ccSelectedFilter === "isAfter") {
    return qb ? qb.greaterThan(new Date(filterValue)) : function (fieldVal) {
      return moment(fieldVal).valueOf() > moment(filterValue).valueOf();
    };
  } else if (ccSelectedFilter === "greaterThan") {
    return qb ? qb.greaterThan(filterValue) : function (fieldVal) {
      return fieldVal > filterValue;
    };
  } else if (ccSelectedFilter === "lessThan") {
    return qb ? qb.lessThan(filterValue) : function (fieldVal) {
      return fieldVal < filterValue;
    };
  } else if (ccSelectedFilter === "inRange") {
    return qb ? qb.between([filterValue[0], filterValue[1]]) : function (fieldVal) {
      return filterValue[0] <= fieldVal && fieldVal <= filterValue[1];
    };
  } else if (ccSelectedFilter === "equalTo") {
    return qb ? filterValue : function (fieldVal) {
      return fieldVal === filterValue;
    };
  }

  throw new Error("Unsupported filter " + selectedFilter + ". Please make a new filter if you need one");
}

export function getCurrentParamsFromUrl(location) {
  var search = location.search;

  return parseFilters(queryString.parse(search));
}
export function setCurrentParamsOnUrl(newParams, replace) {
  var stringifiedFilters = stringifyFilters(newParams);
  replace({
    search: "?" + queryString.stringify(stringifiedFilters)
  });
}

function stringifyFilters(newParams) {
  var filters = void 0;
  if (newParams.filters && newParams.filters.length) {
    filters = newParams.filters.reduce(function (acc, _ref, index) {
      var filterOn = _ref.filterOn,
          selectedFilter = _ref.selectedFilter,
          filterValue = _ref.filterValue;

      acc += (index > 0 ? "___" : "") + (filterOn + "__" + camelCase(selectedFilter) + "__" + safeStringify(Array.isArray(filterValue) ? filterValue.join(".") : filterValue));
      return acc;
    }, "");
  }
  var order = void 0;
  if (newParams.order && newParams.order.length) {
    order = newParams.order.reduce(function (acc, order, index) {
      acc += (index > 0 ? "___" : "") + order;
      return acc;
    }, "");
  }
  return _extends({}, newParams, {
    filters: filters,
    order: order
  });
}
function parseFilters(newParams) {
  return _extends({}, newParams, {
    order: newParams.order && newParams.order.split("___"),
    filters: newParams.filters && newParams.filters.split("___").map(function (filter) {
      var splitFilter = filter.split("__");
      return {
        filterOn: splitFilter[0],
        selectedFilter: splitFilter[1],
        filterValue: safeParse(splitFilter[2])
      };
    })
  });
}

function buildRef(qb, reference, searchField, expression) {
  var _qb$related$whereAny2;

  if (reference.reference) {
    var _qb$related$whereAny;

    // qb[reference.target] = {}
    return qb.related(reference.target).whereAny((_qb$related$whereAny = {}, _qb$related$whereAny[reference.sourceField] = buildRef(qb, reference.reference, searchField, expression), _qb$related$whereAny));
  }
  return qb.related(reference.target).whereAny((_qb$related$whereAny2 = {}, _qb$related$whereAny2[searchField] = expression, _qb$related$whereAny2));
}

export function makeDataTableHandlers(_ref2) {
  var setNewParams = _ref2.setNewParams,
      resetSearch = _ref2.resetSearch,
      defaults = _ref2.defaults,
      onlyOneFilter = _ref2.onlyOneFilter;

  //all of these actions have currentParams bound to them as their last arg in withTableParams
  function setSearchTerm(searchTerm, currentParams) {
    var newParams = _extends({}, currentParams, {
      page: undefined, //set page undefined to return the table to page 1
      searchTerm: searchTerm === defaults.searchTerm ? undefined : searchTerm
    });
    setNewParams(newParams);
    onlyOneFilter && clearFilters();
  }
  function addFilters(newFilters, currentParams) {
    if (!newFilters) return;
    var filters = uniqBy([].concat(newFilters, onlyOneFilter ? [] : currentParams.filters || []), "filterOn");

    var newParams = _extends({}, currentParams, {
      page: undefined, //set page undefined to return the table to page 1
      filters: filters
    });
    setNewParams(newParams);
    onlyOneFilter && resetSearch();
  }
  function removeSingleFilter(filterOn, currentParams) {
    var filters = currentParams.filters ? currentParams.filters.filter(function (filter) {
      return filter.filterOn !== filterOn;
    }) : undefined;
    var newParams = _extends({}, currentParams, {
      filters: filters
    });
    setNewParams(newParams);
  }
  function clearFilters() {
    var additionalFilterKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var toClear = {
      filters: undefined,
      searchTerm: undefined,
      tags: undefined
    };
    additionalFilterKeys.forEach(function (key) {
      toClear[key] = undefined;
    });
    setNewParams(toClear);
    resetSearch();
  }
  function setPageSize(pageSize, currentParams) {
    var newParams = _extends({}, currentParams, {
      pageSize: pageSize === defaults.pageSize ? undefined : pageSize,
      page: undefined //set page undefined to return the table to page 1
    });
    setNewParams(newParams);
  }
  function setOrder(order, isRemove, shiftHeld, currentParams) {
    var newOrder = [];
    if (shiftHeld) {
      //first remove the old order
      newOrder = [].concat(currentParams.order || []).filter(function (value) {
        var shouldRemove = value.replace(/^-/, "") === order.replace(/^-/, "");
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
    var newParams = _extends({}, currentParams, {
      order: newOrder
    });
    setNewParams(newParams);
  }
  function setPage(page, currentParams) {
    var newParams = _extends({}, currentParams, {
      page: page === defaults.page ? undefined : page
    });
    setNewParams(newParams);
  }
  return {
    setSearchTerm: setSearchTerm,
    addFilters: addFilters,
    clearFilters: clearFilters,
    removeSingleFilter: removeSingleFilter,
    setPageSize: setPageSize,
    setPage: setPage,
    setOrder: setOrder,
    setNewParams: setNewParams
  };
}

// if an inList value only has two items like
// 2.3 then it will get parsed to a number and
// break, convert it back to a string here
function cleanupFilter(filter) {
  var filterToUse = filter;
  if (filterToUse.selectedFilter === "inList" && typeof filterToUse.filterValue === "number") {
    filterToUse = _extends({}, filterToUse, {
      filterValue: filterToUse.filterValue.toString()
    });
  }
  if (filterToUse.selectedFilter === "inList") {
    filterToUse = _extends({}, filterToUse, {
      filterValue: filterToUse.filterValue.replace(/, |,/g, ".")
    });
  }
  return filterToUse;
}

function getAllFilters(filters, searchTerm, schema) {
  var allFilters = [].concat(filters, getFiltersFromSearchTerm(searchTerm, schema));

  allFilters = allFilters.filter(function (val) {
    return val !== "";
  }); //get rid of erroneous filters

  return allFilters.map(cleanupFilter);
}

export function getQueryParams(_ref3) {
  var currentParams = _ref3.currentParams,
      urlConnected = _ref3.urlConnected,
      defaults = _ref3.defaults,
      schema = _ref3.schema,
      isInfinite = _ref3.isInfinite,
      entities = _ref3.entities,
      isLocalCall = _ref3.isLocalCall,
      additionalFilter = _ref3.additionalFilter;

  Object.keys(currentParams).forEach(function (key) {
    if (currentParams[key] === undefined) {
      delete currentParams[key]; //we want to use the default value if any of these are undefined
    }
  });
  var tableQueryParams = _extends({}, defaults, currentParams);
  var page = tableQueryParams.page,
      pageSize = tableQueryParams.pageSize,
      searchTerm = tableQueryParams.searchTerm,
      filters = tableQueryParams.filters,
      order = tableQueryParams.order;

  if (page <= 0 || isNaN(page)) {
    page = undefined;
  }
  if (isInfinite) {
    page = undefined;
    pageSize = undefined;
  }
  if (pageSize !== undefined) {
    //pageSize might come in as an unexpected number so we coerce it to be one of the nums in our pageSizes array
    var closest = clone(pageSizes).sort(function (a, b) {
      return Math.abs(pageSize - a) - Math.abs(pageSize - b);
    })[0];
    pageSize = closest;
  }
  var toReturn = {
    //these are values that might be generally useful for the wrapped component
    page: page,
    pageSize: pageSize,
    order: order,
    filters: filters,
    searchTerm: searchTerm
  };

  if (isLocalCall) {
    var newEntities = entities;
    //if the table is local (aka not directly connected to a db) then we need to
    //handle filtering/paging/sorting all on the front end
    newEntities = filterEntitiesLocal(filters, searchTerm, newEntities, schema);
    newEntities = orderEntitiesLocal(order, newEntities, schema);

    var newEntityCount = newEntities.length;
    //calculate the sorted, filtered, paged entities for the local table

    if (!isInfinite) {
      var offset = (page - 1) * pageSize;
      newEntities = take(drop(newEntities, offset), pageSize);
    }
    toReturn.entities = newEntities;
    toReturn.entityCount = newEntityCount;
    //if this call is being made by a local-data only connected datatable component,
    //we don't want to do the following gql stuff
    return toReturn;
  } else {
    var graphqlQueryParams = {
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

    var model = schema.model;

    var qb = new QueryBuilder(model);
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

    var ccFields = getFieldsMappedByCCDisplayName(schema);

    if (tableQueryParams.order && tableQueryParams.order.length) {
      tableQueryParams.order.forEach(function (orderVal) {
        var ccDisplayName = orderVal.replace(/^-/gi, "");
        var schemaForField = ccFields[ccDisplayName];
        if (schemaForField) {
          var path = schemaForField.path;

          var reversed = ccDisplayName !== orderVal;
          var prefix = reversed ? "-" : "";
          graphqlQueryParams.sort = [].concat(graphqlQueryParams.sort || [], [prefix + path]);
        } else {
          console.error("No schema for field found!", ccDisplayName, schema.fields);
        }
      });
    }

    var errorParsingUrlString = void 0;
    var allFilters = getAllFilters(filters, searchTerm, schema);

    var _getAndAndOrFilters2 = getAndAndOrFilters(allFilters),
        andFilters = _getAndAndOrFilters2.andFilters,
        orFilters = _getAndAndOrFilters2.orFilters;

    var additionalFilterToUse = additionalFilter(qb, currentParams);
    try {
      qb.whereAll(getQueries(andFilters, qb, ccFields)).andWhereAll(additionalFilterToUse).andWhereAny(getQueries(orFilters, qb, ccFields));
    } catch (e) {
      if (urlConnected) {
        errorParsingUrlString = e;
        console.error("The following error occurred when trying to build the query params. This is probably due to a malformed URL:", e);
      } else {
        console.error("Error building query params from filter:");
        throw e;
      }
    }

    graphqlQueryParams.filter = qb.toJSON();
    return _extends({}, toReturn, {
      //the query params will get passed directly to as variables to the graphql query
      variables: graphqlQueryParams,
      errorParsingUrlString: errorParsingUrlString
    });
  }
}

function getQueries(filters, qb, ccFields) {
  var subQueries = filters.reduce(function (acc, filter) {
    if (!filter) {
      console.warn("We should always have a filter object!");
      return acc;
    }
    var selectedFilter = filter.selectedFilter,
        filterValue = filter.filterValue,
        filterOn = filter.filterOn;

    var subFilter = getSubFilter(qb, selectedFilter, filterValue);
    var fieldSchema = ccFields[filterOn];
    if (fieldSchema) {
      var path = fieldSchema.path,
          reference = fieldSchema.reference;

      if (reference) {
        acc[reference.sourceField] = buildRef(qb, reference, last(path.split(".")), subFilter);
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