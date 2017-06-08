import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

import renderBlueprintInput from "./index";
import renderBlueprintCheckbox from "./index";
import renderBlueprintTextarea from "./index";
import renderBlueprintNumericInput from "./index";
import renderBlueprintNumericRadio from "./index";
import renderBlueprintNumericSelector from "./index";

const wrapper = [
  shallow(<renderBlueprintInput />),
  shallow(<renderBlueprintCheckbox />),
  shallow(<renderBlueprintTextarea />),
  shallow(<renderBlueprintNumericInput />),
  shallow(<renderBlueprintNumericRadio />),
  shallow(<renderBlueprintNumericSelector />)
];

const tests = () => {
  return wrapper.forEach(component => {
    it("renders without exploding", () => {
      expect(component).toHaveLength(1);
    });

    it("renders a snapshot", () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
};

describe("Component", () => {
  tests();
});
