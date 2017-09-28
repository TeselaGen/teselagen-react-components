//@flow
import React from "react";
import { Button } from "@blueprintjs/core";
import { FocusStyleManager } from "@blueprintjs/core";
import {  DataTable } from "../../../src";
import "./style.css";


FocusStyleManager.onlyShowFocusOnTabs();

const schema = {
  fields:[{path: 'name'}, {path: 'id', type: 'action', render: () => {
    return <Button className={'pt-minimal pt-icon-circle'}></Button>
  }}]
}

const entities = [
  {
  name: 'Thomas',
  id: '1'
},
  {
  name: 'Taoh',
  id: '2'
},
  {
  name: 'Chris',
  id: '3'
},
  {
  name: 'Sam',
  id: '4'
},
  {
  name: 'Adam',
  id: '5'
},
]
export default function SimpleTable() {
    return <div>
      <DataTable isSimple withCheckboxes entities={entities} schema={schema}></DataTable>
    </div>
}