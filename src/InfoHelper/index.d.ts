// TypeScript Version: 2.5

import { Component } from "react";

export interface IInfoHelper {
  className: string,
  content: any,
  children: any,
  icon: string,
  isPopover: boolean,
  size: number,
}

export default class InfoHelper extends Component<IInfoHelper>{}