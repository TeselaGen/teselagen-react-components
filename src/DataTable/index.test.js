import React from "react";
import { shallow, mount } from "enzyme";
import Component from "./index";
import PagingTool from "./PagingTool";
import DataTableDemo, {
  UrlConnected,
  ReduxConnected,
  DataTableWrapper
} from "../../demo/src/DataTableDemo";

describe("(Component)", () => {
  it("renders without exploding", () => {
    const wrapper = shallow(<Component />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("DataTableDemo", () => {
  const wrapper = mount(<DataTableDemo />);
  const urlWrapper = wrapper.find(UrlConnected);
  const reduxWrapper = wrapper.find(ReduxConnected);

  it("renders url and redux connected", () => {
    expect(urlWrapper).toHaveLength(1);
    expect(reduxWrapper).toHaveLength(1);
  });

  const urlDataWrapper = urlWrapper.find(DataTableWrapper);
  const reduxDataWrapper = reduxWrapper.find(DataTableWrapper);

  it("renders the datatable wrappers", () => {
    expect(urlDataWrapper).toHaveLength(1);
    expect(reduxDataWrapper).toHaveLength(1);
  });

  //tnr commenting out until the new graphql stuff gets added
  // it("updates search term params on input", () => {
  //   const input = reduxDataWrapper.find(".datatable-search-input");
  //   input
  //     .find("input")
  //     .simulate("change", { target: { value: "search string" } });
  //   const button = input.find(".pt-icon-search");
  //   button.simulate("click");
  //   expect(reduxDataWrapper.props().tableParams.searchTerm).toEqual(
  //     "search string"
  //   );
  //   expect(reduxDataWrapper.props().queryParams).toEqual({
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
    const pagingToolbarWrapper = reduxDataWrapper.find(PagingTool);

    it("renders a PagingTool", () => {
      expect(pagingToolbarWrapper).toHaveLength(1);
    });

    const pagingInput = pagingToolbarWrapper.find("input");
    it("pagesize is initialized with a value of 10", () => {
      expect(pagingInput.props().value).toBe("10");
    });

    it("handles a page size change", () => {
      pagingInput.simulate("change", {
        target: {
          value: 2
        }
      });
      expect(pagingInput.props().value).toBe("2");
      pagingInput.simulate("blur");
      expect(reduxDataWrapper.props().queryParams.pageSize).toBe(2);
    });

    it("handles a page right", () => {
      expect(reduxDataWrapper.props().queryParams.pageSize).toBe(2);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(2);

      //   "reduxDataWrapper.props().queryParams",
      //   reduxDataWrapper.props().queryParams
      // );
    });

    it("handles a page left after a page right", () => {
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(2);
      pagingToolbarWrapper.find(".paging-arrow-left").simulate("click");
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(1);
    });

    it("searching brings us back to page 1", () => {
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(1);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(2);
      const input = reduxDataWrapper.find(".datatable-search-input");
      input
        .find("input")
        .simulate("change", { target: { value: "search string" } });
      const button = input.find(".pt-icon-search");
      button.simulate("click");
      expect(reduxDataWrapper.props().tableParams.searchTerm).toEqual(
        "search string"
      );
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(1);
    });
    it("changing page size brings us back to page 1", () => {
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(1);
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(2);
      expect(reduxDataWrapper.props().queryParams.pageSize).toBe(2);
      pagingInput.simulate("change", {
        target: {
          value: 3
        }
      });
      expect(pagingInput.props().value).toBe("3");
      pagingInput.simulate("blur");
      expect(reduxDataWrapper.props().queryParams.pageSize).toBe(3);
      expect(reduxDataWrapper.props().queryParams.pageNumber).toBe(1);
    });
  });
});
