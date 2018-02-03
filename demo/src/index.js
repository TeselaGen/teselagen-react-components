import SimpleTableDemo from "./DataTableDemo/SimpleTableDemo";
import WithDialogDemo from "./WithDialogDemo";
import ReactPlayground from "./ReactPlayground";
import CollapsibleCard from "./examples/CollapsibleCard";
import InfoHelper from "./examples/InfoHelper";
import Loading from "./examples/Loading";
import DownloadLink from "./examples/DownloadLink";
import DemoNav from "./DemoNav";
import DemoHeader from "./DemoHeader";
import { DataTable } from "../../src";
import DataTableDemo from "./DataTableDemo";
import "./style.css";
import React from "react";
import { render } from "react-dom";
import FormComponentsDemo from "./FormComponentsDemo";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

const demos = {
  DataTable: {
    withoutLive: true,
    demo: DataTableDemo,
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/DataTableDemo/index.js",
    childLinks: {
      SimpleTable: {
        withoutLive: true,
        demo: SimpleTableDemo,
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
        name: "iconName",
        type: "string",
        description: "Override the default info icon."
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/InfoHelperDemo/index.js"
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
        name: "iconName",
        description: "BlueprintJS iconName to be displayed in card header",
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
        name: "children",
        type: "React Element",
        description: "Content of the card when open"
      }
    ],
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/CollapsibleCardDemo/index.js"
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
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/LoadingDemo/index.js"
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
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/DownloadLinkDemo/index.js"
  },
  FormComponents: {
    demo: FormComponentsDemo,
    withoutLive: true,
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/FormComponentsDemo/index.js"
  },
  withDialog: {
    demo: WithDialogDemo,
    withoutLive: true,
    url:
      "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/WithDialogDemo/index.js"
  }
  // fonticons: {
  //   demo: FontIconsDemo,
  //   url:
  //     "https://github.com/TeselaGen/teselagen-react-components/blob/master/demo/src/FontIconsDemo/index.js"
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
  { demo: Demo, scope, withoutLive, url, props = [] },
  demoTitle
) {
  return () => {
    const component = withoutLive ? (
      <Demo />
    ) : (
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
              padding: 40
            }}
          >
            <DemoNav demos={demos} />
            <div style={{ margin: 15, width: "100%" }}>
              {Object.keys(demos).map(function(key, index) {
                const demo = demos[key];
                return (
                  <React.Fragment key={key}>
                    <Route
                      path={`/${key}/index`}
                      url={demo.url}
                      component={DemoComponentWrapper(demo, key)}
                    />
                    {Object.keys(
                      demo.childLinks || []
                    ).map((childKey, index2) => {
                      const childDemo = demo.childLinks[childKey];
                      return (
                        <Route
                          exact
                          key={key + childKey + index + index2}
                          path={`/${key}/${childKey}`}
                          url={childDemo.url}
                          component={DemoComponentWrapper(childDemo, childKey)}
                        />
                      );
                    })}
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
