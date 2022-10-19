import React from "react";
import DataTable from "../../../src/DataTable";
import DemoWrapper from "../DemoWrapper";
import OptionsSection from "../OptionsSection";
import { useToggle } from "../renderToggle";

const schema = {
  fields: [
    { path: "name", isEditable: true },
    {
      path: "type",
      isEditable: true,
      type: "dropdown",
      values: ["old", "new"]
    },
    {
      path: "weather",
      isEditable: true,
      type: "dropdown",
      values: ["cloudy", "rainy"]
    },
    {
      path: "howMany",
      isEditable: true,
      type: "numeric"
    },
    {
      path: "isProtein",
      isEditable: true,
      type: "boolean"
    }
  ]
};
const entities = [
  {
    name: "Thomas",
    id: "1",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Taoh",
    id: "2",
    type: "old",
    howMany: "this should fail",
    isProtein: "true",
    weather: "cloudy"
  },
  {
    name: "Chris",
    id: "3",
    type: "new",
    howMany: "3",
    isProtein: false,
    weather: "rainy"
  },
  {
    name: "Sam",
    id: "4",
    type: "old",
    howMany: 300,
    isProtein: false,
    weather: "cloudy"
  },
  {
    name: "Adam",
    id: "5",
    type: "new",
    howMany: NaN,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Kyle",
    id: "6",
    type: "old",
    howMany: 3,
    isProtein: "TRue",
    weather: "cloudy"
  },
  {
    name: "Tiff",
    id: "7",
    type: "new",
    howMany: 3,
    isProtein: "False",
    weather: "cloudy"
  },
  {
    name: "Thomas",
    id: "1*2",
    type: "new",
    howMany: 3,
    isProtein: "false",
    weather: "cloudy"
  },
  {
    name: "Taoh",
    id: "2*2",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Chris",
    id: "3*2",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "rainy"
  },
  {
    name: "Sam",
    id: "4*2",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Adam",
    id: "5*2",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Kyle",
    id: "6*2",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Tiff",
    id: "7*2",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Thomas",
    id: "1+1",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Taoh",
    id: "1+2",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Chris",
    id: "1+3",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "rainy"
  },
  {
    name: "Sam",
    id: "1+4",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Adam",
    id: "1+5",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Kyle",
    id: "1+6",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Tiff",
    id: "1+7",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Thomas",
    id: "1+1*2",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Taoh",
    id: "1+2*2",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Chris",
    id: "1+3*2",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "rainy"
  },
  {
    name: "Sam",
    id: "1+4*2",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Adam",
    id: "1+5*2",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Kyle",
    id: "1+6*2",
    type: "old",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  },
  {
    name: "Tiff",
    id: "1+7*2",
    type: "new",
    howMany: 3,
    isProtein: true,
    weather: "cloudy"
  }
];

export default function SimpleTable(p) {
  const [isEntityDisabled, isEntityDisabledComp] = useToggle({
    type: "isEntityDisabled"
  });
  return (
    <div>
      <OptionsSection>{isEntityDisabledComp}</OptionsSection>
      <DemoWrapper>
        <DataTable
          formName="editableCellTable"
          isSimple
          isCellEditable
          entities={entities}
          schema={schema}
          isEntityDisabled={
            isEntityDisabled
              ? ent => ent.name === "Chris" || ent.name === "Sam"
              : undefined
          }
          {...p}
        ></DataTable>
      </DemoWrapper>
    </div>
  );
}
