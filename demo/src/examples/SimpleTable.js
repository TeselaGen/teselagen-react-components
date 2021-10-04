import { Button } from "@blueprintjs/core";
import React from "react";
import DataTable from "../../../src/DataTable";
import { useToggle } from "../renderToggle";

const schema = {
  fields: [
    { path: "name" },
    {
      path: "id",
      type: "action",
      render: () => {
        return <Button minimal icon="circle" />;
      }
    },
    "type",
    "weather",
    "other",
    "something",
    "nothing"
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
  const [withCheckboxes, withCheckboxesComp] = useToggle({
    type: "withCheckboxes"
  });
  return (
    <div>
      {isEntityDisabledComp}
      {withCheckboxesComp}
      <DataTable
        formName="simpleTable"
        isSimple
        withCheckboxes={withCheckboxes}
        entities={entities}
        schema={schema}
        isEntityDisabled={
          isEntityDisabled
            ? ent => ent.name === "Chris" || ent.name === "Sam"
            : undefined
        }
        {...p}
      >
        <div>hey</div>
      </DataTable>
    </div>
  );
}
