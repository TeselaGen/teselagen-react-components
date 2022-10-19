import { Button } from "@blueprintjs/core";
import React from "react";
import DataTable from "../../../src/DataTable";
import DemoWrapper from "../DemoWrapper";
import OptionsSection from "../OptionsSection";
import { useToggle } from "../renderToggle";

const schema = {
  fields: [
    { path: "url", type: "markdown" },
    { path: "name", isEditable: true },
    {
      path: "id",
      type: "action",
      render: () => {
        return <Button minimal icon="circle" />;
      }
    },
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
    },
    "other",
    "something",
    "nothing"
  ]
};
const entities = [
  {
    url: "[Duck Duck Go](https://duckduckgo.com)",
    name: "Thomas",
    id: "1",
    type: "new",
    weather: "cloudy"
  },
  {
    url: "https://froogle.com",
    name: "Taoh",
    id: "2",
    type: "old",
    weather: "cloudy"
  },
  {
    url: "https://google.com",
    name: "Chris",
    id: "3",
    type: "new",
    weather: "rainy"
  },
  {
    url: `*I'm some markdown* 
#### ayy`,
    name: "Sam",
    id: "4",
    type: "old",
    weather: "cloudy"
  },
  {
    url: "**more markdown**",
    name: "Adam",
    id: "5",
    type: "new",
    weather: "cloudy"
  },
  {
    url: "# https://google.com",
    name: "Kyle",
    id: "6",
    type: "old",
    weather: "cloudy"
  },
  {
    url: "https://google.com",
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
