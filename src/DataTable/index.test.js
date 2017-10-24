import React from "react";
import { shallow, mount } from "enzyme";
import { ApolloProvider, ApolloClient } from "react-apollo";

import DataTable from "./index";
import PagingTool from "./PagingTool";
import DataTableDemo, { DataTableInstance } from "../../demo/src/DataTableDemo";
const client = new ApolloClient({});
describe("(DataTable)", () => {
  it("renders without exploding", () => {
    const wrapper = shallow(
      <ApolloProvider client={client} store={{}}>
        <DataTable />
      </ApolloProvider>
    );
    expect(wrapper).toHaveLength(1);
  });
});

describe("DataTableDemo", () => {
  const dataTableDemo = mount(<DataTableDemo urlConnected={false} />);
  const dataTableInstance = dataTableDemo.find(DataTableInstance);

  it("renders the demo and the DataTableInstance", () => {
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

  describe("PagingTool", () => {
    const pagingToolbarWrapper = dataTableInstance.find(PagingTool);

    it("renders a PagingTool", () => {
      expect(pagingToolbarWrapper).toHaveLength(1);
    });

    const pagingSelect = pagingToolbarWrapper.find(".paging-page-size");

    it("pagesize is initialized with a value of 10", () => {
      expect(pagingSelect.props().value).toBe(10);
    });

    it("handles a page size change", () => {
      pagingSelect.simulate("change", {
        target: {
          value: 25 // must be a valid option in the select field
        }
      });
      console.log('pagingSelect.props().value:', pagingSelect.props().value)
      expect(pagingSelect.props().value).toBe(25);
      pagingSelect.simulate("blur");
      expect(dataTableInstance.props().variables.pageSize).toBe(25);
    });

    it("handles a page right", () => {
      expect(dataTableInstance.props().variables.pageSize).toBe(10);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(dataTableInstance.props().variables.pageNumber).toBe(2);
    });

    it("handles a page left after a page right", () => {
      expect(dataTableInstance.props().variables.pageNumber).toBe(2);
      pagingToolbarWrapper.find(".paging-arrow-left").simulate("click");
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
    });

    it("searching brings us back to page 1", () => {
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(dataTableInstance.props().variables.pageNumber).toBe(2);
      const input = dataTableInstance.find(".datatable-search-input");
      input
        .find("input")
        .simulate("change", { target: { value: "search string" } });
      const button = input.find(".pt-icon-search");
      button.simulate("click");
      expect(dataTableInstance.props().tableParams.searchTerm).toEqual(
        "search string"
      );
      expect(dataTableInstance.props().variables.pageNumber).toBe(1);
    });
    it("changing page size brings us back to page 1", () => {
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
