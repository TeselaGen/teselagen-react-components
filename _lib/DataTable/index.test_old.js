"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _enzyme = require("enzyme");

var _reactApollo = require("react-apollo");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _PagingTool = require("./PagingTool");

var _PagingTool2 = _interopRequireDefault(_PagingTool);

var _DataTableDemo = require("../../demo/src/DataTableDemo");

var _DataTableDemo2 = _interopRequireDefault(_DataTableDemo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = new _reactApollo.ApolloClient({});
describe("(DataTable)", function () {
  it("renders without exploding", function () {
    var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(
      _reactApollo.ApolloProvider,
      { client: client, store: {} },
      _react2.default.createElement(_index2.default, null)
    ));
    expect(wrapper).toHaveLength(1);
  });
});

describe("DataTableDemo", function () {
  var dataTableDemo = (0, _enzyme.mount)(_react2.default.createElement(_DataTableDemo2.default, { urlConnected: false }));
  var dataTableInstance = dataTableDemo.find(_DataTableDemo.DataTableInstance);

  it("renders the demo and the DataTableInstance", function () {
    expect(dataTableDemo).toHaveLength(1);
    expect(dataTableInstance).toHaveLength(1);
  });

  //tnr commenting out until the new graphql stuff gets added
  // it("updates search term params on input", () => {
  //   const input = dataTableInstance.find(".datatable-search-input");
  //   input
  //     .find("input")
  //     .simulate("change", { target: { value: "search string" } });
  //   const button = input.find(".pt-icon-search");
  //   button.simulate("click");
  //   expect(dataTableInstance.props().tableParams.searchTerm).toEqual(
  //     "search string"
  //   );
  //   expect(dataTableInstance.props().variables).toEqual({
  //     include: {},
  //     limit: 10,
  //     offset: 0,
  //     order: "",
  //     where: {
  //       $or: {
  //         addedBy: { iLike: "%search string%" },
  //         name: { iLike: "%search string%" }
  //       }
  //     }
  //   });
  // });

  describe("PagingTool", function () {
    var pagingToolbarWrapper = dataTableInstance.find(_PagingTool2.default);

    it("renders a PagingTool", function () {
      expect(pagingToolbarWrapper).toHaveLength(1);
    });

    var pagingSelect = pagingToolbarWrapper.find(".paging-page-size");

    it("pagesize is initialized with a value of 10", function () {
      expect(pagingSelect.props().value).toBe(10);
    });

    it.only("handles a page size change", function () {
      pagingSelect.simulate("change", {
        target: {
          value: 25 // must be a valid option in the select field
        }
      });
      // dataTableDemo.update()

      // debugger
      console.log("pagingSelect.props().value:", pagingSelect.props().value);
      expect(pagingSelect.props().value).toBe(25);
      pagingSelect.simulate("blur");
      expect(dataTableInstance.props().variables.pageSize).toBe(25);
    });

    it("handles a page right", function () {
      expect(dataTableInstance.props().variables.pageSize).toBe(10);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(dataTableInstance.props().variables.pageNumber).toBe(2);
    });

    it("handles a page left after a page right", function () {
      expect(dataTableInstance.props().variables.pageNumber).toBe(2);
      pagingToolbarWrapper.find(".paging-arrow-left").simulate("click");
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
    });

    it("searching brings us back to page 1", function () {
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(dataTableInstance.props().variables.pageNumber).toBe(2);
      var input = dataTableInstance.find(".datatable-search-input");
      input.find("input").simulate("change", { target: { value: "search string" } });
      var button = input.find(".bp3-icon-search");
      button.simulate("click");
      expect(dataTableInstance.props().tableParams.searchTerm).toEqual("search string");
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
    });
    it("changing page size brings us back to page 1", function () {
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(dataTableInstance.props().variables.pageNumber).toBe(2);
      expect(dataTableInstance.props().variables.pageSize).toBe(5);
      pagingSelect.simulate("change", {
        target: {
          value: 10
        }
      });
      expect(pagingSelect.props().value).toBe(10);
      pagingSelect.simulate("blur");
      expect(dataTableInstance.props().variables.pageSize).toBe(10);
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
    });
  });
});