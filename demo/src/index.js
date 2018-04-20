import ReactPlayground from "./ReactPlayground";
import CollapsibleCard from "./examples/CollapsibleCard";
import MenuBar from "./examples/MenuBar";
import HotkeysDialog from "./examples/HotkeysDialog";
import DataTableExample from "./examples/DataTable";
import FormComponents from "./examples/FormComponents";
import WithDialog from "./examples/WithDialog";
import Toastr from "./examples/Toastr";
import CustomIcons from "./examples/CustomIcons";
import SimpleTable from "./examples/SimpleTable";
import InfoHelper from "./examples/InfoHelper";
import Loading from "./examples/Loading";
import DownloadLink from "./examples/DownloadLink";
import DemoNav from "./DemoNav";
import DemoHeader from "./DemoHeader";
import { withTableParams, DataTable, PagingTool } from "../../src";
import Uploader from "../../src/FormComponents/Uploader";
import J5ReportRecordView from "./examples/J5ReportRecordView";
import j5ReportRecordViewData from "./data/j5ReportRecordView";
import * as customIcons from "../../src/customIcons";
import "./style.css";
import React from "react";
import { render } from "react-dom";
import {
  HashRouter as Router,
  Route,
  withRouter,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import store from "./store";
import {
  Dialog,
  MenuItem,
  FocusStyleManager,
  Position,
  Intent,
  KeyCombo
} from "@blueprintjs/core";
import renderToggle from "./renderToggle";
import Chance from "chance";
import times from "lodash/times";
import client from "./client";
import { ApolloProvider } from "react-apollo";
import { addMenuHotkeys, addMenuHandlers } from "../../src/utils/menuUtils";
import { withHotkeys } from "../../src/utils/hotkeyUtils";

FocusStyleManager.onlyShowFocusOnTabs();

const demos = {
  DataTable: {
    demo: DataTableExample,
    scope: {
      MenuItem,
      ApolloProvider,
      Dialog,
      client,
      withTableParams,
      DataTable,
      PagingTool,
      renderToggle,
      Router,
      withRouter,
      store,
      Chance,
      times
    },
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/DataTableDemo.js",
    childLinks: {
      SimpleTable: {
        demo: SimpleTable,
        url:
          "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/DataTableDemo/SimpleTableDemo.js"
      }
    }
  },
  InfoHelper: {
    demo: InfoHelper,
    props: [
      {
        name: "className",
        description:
          "The CSS class name passed to the Button (if Popover) or Tooltip",
        type: "string"
      },
      {
        name: "isPopover",
        description:
          "If true then tooltip will be shown on click and false will show tooltip on hover",
        type: "boolean"
      },
      {
        name: "children",
        type: "React Element",
        description: "The contents of the Popover or Tooltip"
      },
      {
        name: "content",
        description:
          "A different way to specify the contents of the Popover or Tooltip",
        type: "React Element"
      },
      {
        name: "size",
        description: "Size of the icon",
        type: "number"
      },
      {
        name: "icon",
        type: "string",
        description: "Override the default info icon."
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/InfoHelperDemo.js"
  },
  CollapsibleCard: {
    demo: CollapsibleCard,
    props: [
      {
        name: "title",
        description: "Header for the card",
        type: "string | React Element"
      },
      {
        name: "icon",
        description: "BlueprintJS icon to be displayed in card header",
        type: "string"
      },
      {
        name: "icon",
        description: "Custom icon to be displayed in card header",
        type: "React Element"
      },
      {
        name: "openTitleElements",
        type: "React Element",
        description: "Items to be displayed in header when card is open"
      },
      {
        name: "noCard",
        description: "Removes card styling",
        type: "boolean"
      },
      {
        name: "children",
        type: "React Element",
        description: "Content of the card when open"
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/CollapsibleCardDemo.js"
  },
  'Hotkeys and HotkeysDialog': {
    demo: HotkeysDialog,
    scope: {
      KeyCombo
    },
    props: [
      {
        name: "hotkeySets",
        description:
          "Object holding hotkey sets (keys are set names, values are hotkey objects)",
        type: "Object"
      },
      {
        name: "isOpen",
        description:
          "Flag indicating whether the dialog should be visible",
        type: "boolean"
      },
      {
        name: "onClose",
        description:
          "Callback to run when the user attempts to close the dialog",
        type: "function"
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/examples/HotkeysDialog.js"
  },
  'MenuBar': {
    demo: MenuBar,
    scope: {
      addMenuHotkeys,
      addMenuHandlers,
      withHotkeys
    },
    props: [
      {
        name: "menu",
        description:
          "Menu structure. Array of objects with `text` and `submenu` properties.",
        type: "Array"
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/examples/MenuBar.js"
  },
  Loading: {
    demo: Loading,
    props: [
      {
        name: "className",
        description: "The CSS class name of the loading component",
        type: "string"
      },
      {
        name: "style",
        description: "Style properties for the loading component",
        type: "string"
      },
      {
        name: "children",
        type: "React Element",
        description: "Returned when loading is false"
      },
      {
        name: "loading",
        description:
          "Only used when children are passed. If true then children are hidden, false children are rendered",
        type: "string"
      },
      {
        name: "bounce",
        description: "Displays the bouncing lines style loader",
        type: "boolean"
      },
      {
        name: "inDialog",
        type: "boolean",
        description: "Sets a min-height of 200 and sets bounce to true"
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/LoadingDemo.js"
  },
  DownloadLink: {
    demo: DownloadLink,
    props: [
      {
        name: "filename",
        description: "Name of the downloaded file",
        type: "string"
      },
      {
        name: "fileString",
        description: "Contents of the downloaded file",
        type: "string"
      },
      {
        name: "getFileString",
        type: "function",
        description: "A function that will return the contents to be downloaded"
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/DownloadLinkDemo.js"
  },
  FormComponents: {
    demo: FormComponents,
    scope: {
      Position,
      Intent,
      Provider,
      store,
      reduxForm,
      Uploader
    },
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/FormComponentsDemo.js"
  },
  withDialog: {
    demo: WithDialog,
    scope: {
      renderToggle
    },
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/examples/WithDialog.js"
  },
  toastr: {
    demo: Toastr,
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/examples/Toastr.js"
  },
  customIcons: {
    scope: {
      customIcons
    },
    demo: CustomIcons,
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/examples/CustomIcons.js"
  },
  J5ReportRecordView: {
    demo: J5ReportRecordView,
    scope: {
      data: j5ReportRecordViewData
    }
  }
  // fonticons: {
  //   demo: FontIconsDemo,
  //   url:
  //     "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/FontIconsDemo.js"
  // }
};

const demoPropsSchema = [
  {
    displayName: "Name",
    path: "name",
    width: 200,
    render: v => <span style={{ color: "#5bc0de" }}>{v}</span>
  },
  {
    displayName: "Type",
    width: 200,
    path: "type",
    render: v => <span style={{ color: "#ff758d" }}>{v}</span>
  },
  {
    displayName: "Description",
    path: "description"
  }
];

function DemoComponentWrapper(
  { demo: Demo, scope, url, props = [] },
  demoTitle
) {
  return () => {
    const component = (
      <div>
        <ReactPlayground codeText={Demo} scope={scope} />
        {!!props.length && (
          <React.Fragment>
            <h6
              style={{
                marginTop: 25,
                marginBottom: 15
              }}
            >
              Properties
            </h6>
            <DataTable
              formName="demoProps"
              entities={props}
              isSimple
              schema={demoPropsSchema}
            />
          </React.Fragment>
        )}
      </div>
    );
    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            marginBottom: 20,
            justifyContent: "space-between"
          }}
        >
          <h4>{demoTitle}</h4>
          <a href={url} target="_blank">
            Demo Source
          </a>
        </div>
        {component}
      </React.Fragment>
    );
  };
}

const Demo = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <DemoHeader />
          <div
            style={{
              display: "flex",
              padding: 40,
              maxWidth: "100vw"
            }}
          >
            <DemoNav demos={demos} />
            <div
              style={{
                overflow: "auto",
                padding: 10
              }}
            >
              <Route
                exact
                path="/"
                render={() => <Redirect to={Object.keys(demos)[0]} />}
              />
              {Object.keys(demos).map(function(key, index) {
                const demo = demos[key];
                return (
                  <React.Fragment key={key}>
                    <Route
                      exact
                      path={`/${key}`}
                      url={demo.url}
                      component={DemoComponentWrapper(demo, key)}
                    />
                    {Object.keys(demo.childLinks || []).map(
                      (childKey, index2) => {
                        const childDemo = demo.childLinks[childKey];
                        return (
                          <Route
                            exact
                            key={key + childKey + index + index2}
                            path={`/${key}/${childKey}`}
                            url={childDemo.url}
                            component={DemoComponentWrapper(
                              childDemo,
                              childKey
                            )}
                          />
                        );
                      }
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

render(<Demo />, document.querySelector("#demo"));
