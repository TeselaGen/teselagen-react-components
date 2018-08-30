import React from "react";
import { shallow, mount } from "enzyme";
import Component from "./index";

describe("(Component)", () => {
  it("renders without exploding", () => {
    const wrapper = shallow(<Component />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
