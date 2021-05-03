import { Button } from "@blueprintjs/core";
import React from "react";
import DataTable from "../../../src/DataTable";

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
    "weather1",
    "weather2",
    "weather3",
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
  }
];

export default function SimpleTable(p) {
  return (
    <DataTable
      formName="simpleTable"
      isSimple
      entities={entities}
      schema={schema}
      {...p}
    >
      <div>hey</div>
    </DataTable>
  );
}
