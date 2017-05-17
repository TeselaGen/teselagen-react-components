import { reset } from "redux-form";
import isEqual from "lodash/isEqual";
import queryString from "query-string";

export default function queryParams({ columns, schema, defaults = {} }) {
  var defaultParams = {
    pageSize: 10,
    order: "",
    where: {},
    include: [],
    searchTerm: "", //undefined helps us compare when this has been changed to an empty string
    page: 1,
    ...defaults
  };

  // function getCurrentParams(location) {
  //   let currentParams = {
  //     ...defaultParams,
  //     ...getParamsFromRoute(location)
  //   };
  //   return currentParams;
  // }

  function getCurrentParams(location) {
    const { search } = location;
    return jsonParseNested(queryString.parse(search));
  }

  return {
    getQueryParamsFromRouter: function({ location }) {
      let graphqlQueryParams = {
        ...defaultParams,
        ...getCurrentParams(location)
      };
      const { page, pageSize } = graphqlQueryParams;
      //convert params from user readable to what our api expects
      // aka page -> offset & pageSize -> limit
      graphqlQueryParams.offset = (page - 1) * pageSize;
      graphqlQueryParams.limit = pageSize;

      delete graphqlQueryParams.pageSize;
      delete graphqlQueryParams.page;

      const {
        searchTerm,
        selectedFilter,
        filterValue,
        fieldName
      } = graphqlQueryParams;
      delete graphqlQueryParams.searchTerm;
      delete graphqlQueryParams.selectedFilter;
      delete graphqlQueryParams.filterValue;
      delete graphqlQueryParams.fieldName;
      if (selectedFilter) {
        const subFilter = getSubFilter(selectedFilter, filterValue, fieldName);
        const { path, model } = schema.fields[fieldName];
        const wherekey = model ? `$${path}$` : fieldName;
        graphqlQueryParams = {
          ...graphqlQueryParams,
          where: {
            [wherekey]: subFilter
          },
          include: model
            ? {
                [model]: {
                  model,
                  required: false
                }
              }
            : undefined
        };
      }
      if (searchTerm) {
        //custom logic based on the table schema to get the sequelize query
        let include = {};
        let or = {};
        columns.forEach(function(column) {
          const { model, type, path } = schema.fields[column];
          if (type === "string" || type === "lookup") {
            var likeObj = { iLike: "%" + graphqlQueryParams.searchTerm + "%" };
            if (model) {
              const includeObj = include[model] || {
                model,
                required: false
              };
              include[model] = includeObj;
              or["$" + path + "$"] = likeObj;
            } else {
              or[column] = likeObj;
            }
          }
        }, {});
        graphqlQueryParams = {
          ...graphqlQueryParams,
          offset: 0,
          where: {
            $or: or
          },
          include
        };
      }
      return {
        queryParams: graphqlQueryParams,
        page,
        pageSize,
        order: graphqlQueryParams.order,
        selectedFilter,
        filterValue,
        fieldName,
        searchTerm
      };
    },
    setQueryParamsOnRouter: function(dispatch, { history, location }) {
      const { push } = history;
      function setSearchTerm(searchTerm) {
        const currentParams = getCurrentParams(location);
        let newParams = {
          ...currentParams,
          searchTerm: searchTerm === defaultParams.searchTerm
            ? undefined
            : searchTerm
        };
        push({
          search: `?${queryString.stringify(jsonStringifyNested(newParams))}`
        });
      }
      function setFilter({ selectedFilter, filterValue, fieldName }) {
        const currentParams = getCurrentParams(location);
        let newParams = {
          ...currentParams,
          selectedFilter,
          fieldName,
          filterValue,
          searchTerm: undefined
        };
        push({
          search: `?${queryString.stringify(jsonStringifyNested(newParams))}`
        });
        setTimeout(function() {
          dispatch(reset("dataTableSearchInput"));
        });
      }
      function clearFilters() {
        push({
          search: ""
        });
        setTimeout(function() {
          dispatch(reset("dataTableSearchInput"));
        });
      }
      function setPageSize(pageSize) {
        const currentParams = getCurrentParams(location);
        let newParams = {
          ...currentParams,
          pageSize: pageSize === defaultParams.pageSize ? undefined : pageSize
        };
        push({
          search: `?${queryString.stringify(jsonStringifyNested(newParams))}`
        });
      }
      function setOrder(order) {
        const currentParams = getCurrentParams(location);
        let newParams = {
          ...currentParams,
          order: order === defaultParams.order ? undefined : order
        };
        push({
          search: `?${queryString.stringify(jsonStringifyNested(newParams))}`
        });
      }
      function setPage(page) {
        const currentParams = getCurrentParams(location);
        let newParams = {
          ...currentParams,
          page: page === defaultParams.page ? undefined : page
        };
        push({
          search: `?${queryString.stringify(jsonStringifyNested(newParams))}`
        });
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

function getSubFilter(selectedFilter, filterValue, fieldName) {
  if (selectedFilter === "Text starts with")
    return { $iLike: `${filterValue}%` };
  else if (selectedFilter === "Text ends with")
    return { $iLike: `%${filterValue}` };
  else if (selectedFilter === "Text contains")
    return { $iLike: `%${filterValue}%` };
  else if (selectedFilter === "Text is exactly")
    return { $iLike: `${filterValue}` };
  else if (selectedFilter === "Date is between")
    // else if (selectedFilter === "Date is")
    //   return {
    //     $between: [
    //       filterValue.getTime(),
    //       filterValue.getTime() + 4320000
    //     ]
    //   };
    return {
      $between: [filterValue[0].getTime(), filterValue[1].getTime()]
    };
  else if (selectedFilter === "Date is before")
    return { $lt: filterValue.getTime() };
  else if (selectedFilter === "Date is after")
    return { $gt: filterValue.getTime() };
  else if (selectedFilter === "Greater than") return { $gt: filterValue };
  else if (selectedFilter === "Less than") return { $lt: filterValue };
  else if (selectedFilter === "In range")
    return { $between: [filterValue[0], filterValue[1]] };
  else if (selectedFilter === "Equal to") return filterValue;
}
