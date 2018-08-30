import React from "react";
import { shallow } from "enzyme";

import MenuBar from "./index";

const wrapper = shallow(<MenuBar menu={[]} />);

describe("MenuBar", () => {
  it("renders without exploding", () => {
    expect(wrapper).toBeTruthy();
  });
});
