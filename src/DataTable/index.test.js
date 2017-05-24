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

  it("renders a search bar", () => {
    const clearFilters = jest.fn();
    const wrapper = shallow(
      <Component searchTerm="woeif" withSearch clearFilters={clearFilters} />
    );
    const clearFilterBtn = wrapper.find(".data-table-clear-filters");
    expect(clearFilterBtn).toHaveLength(1);
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

  it("updates search term params on input", () => {
    const input = reduxDataWrapper.find(".datatable-search-input");
    input
      .find("input")
      .simulate("change", { target: { value: "search string" } });
    const button = input.find(".pt-icon-search");
    button.simulate("click");
    expect(reduxDataWrapper.props().tableParams.searchTerm).toEqual(
      "search string"
    );
    expect(reduxDataWrapper.props().queryParams).toEqual({
      include: {},
      limit: 10,
      offset: 0,
      order: "",
      where: {
        $or: {
          addedBy: { iLike: "%search string%" },
          name: { iLike: "%search string%" }
        }
      }
    });
  });

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
      expect(reduxDataWrapper.props().queryParams.limit).toBe(2);
    });

    it("handles a page right", () => {
      pagingToolbarWrapper.find(".paging-arrow-right").simulate("click");
      expect(reduxDataWrapper.props().queryParams.offset).toBe(10);
      console.log(
        "reduxDataWrapper.props().queryParams",
        reduxDataWrapper.props().queryParams
      );
    });

    it("handles a page left after a page right", () => {
      expect(reduxDataWrapper.props().queryParams.offset).toBe(10);
      pagingToolbarWrapper.find(".paging-arrow-left").simulate("click");
      expect(reduxDataWrapper.props().queryParams.offset).toBe(0);
    });
  });
});
