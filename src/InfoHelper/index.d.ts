// TypeScript Version: 2.5

import { Component } from "react";

export interface IInfoHelper {
  className: String,
  content: any,
  children: any,
  iconName: String,
  isPopover: Boolean,
  size: Number,
}

export default class InfoHelper extends Component<IInfoHelper>{}