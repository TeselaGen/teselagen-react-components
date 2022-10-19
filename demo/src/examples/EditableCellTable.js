import { Button } from "@blueprintjs/core";
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
    weather: "cloudy"
  },
  {
    name: "Taoh",
    id: "2",
    type: "old",
    weather: "cloudy"
  },
  {
    name: "Chris",
    id: "3",
    type: "new",
    weather: "rainy"
  },
  {
    name: "Sam",
    id: "4",
    type: "old",
    weather: "cloudy"
  },
  {
    name: "Adam",
    id: "5",
    type: "new",
    weather: "cloudy"
  },
  {
    name: "Kyle",
    id: "6",
    type: "old",
    weather: "cloudy"
  },
  {
    name: "Tiff",
    id: "7",
    type: "new",
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
        >
          <div>hey, I am the child</div>
        </DataTable>
      </DemoWrapper>
    </div>
  );
}
