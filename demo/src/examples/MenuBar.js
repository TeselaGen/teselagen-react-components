class MenuBarDemo extends React.Component {
  constructor(props) {
    super(props);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);

    // This can be (re)used for hotkey processing, decorating bar or context
    // menus, and populating the hotkeys dialog
    const hotkeys = {
      newFile: { combo: "mod+ctrl+n", preventDefault: true }, // object syntax
      openFile: ["mod+o", undefined, { preventDefault: true }], // no preventDefault: will also trigger browser's open
      quit: ["mod+ctrl+q", "Quit App", { preventDefault: true }], // custom label
      cut: ["mod+x"], // array shorthand
      copy: "mod+c", // string shorthand
      paste: "mod+v"
    };

    // This can be (re)used for hotkey handling, top menu clicks, context menu
    // clicks, etc.
    const handlers = {
      newFile: () => alert('Triggered "New File"'),
      openFile: () => alert('Triggered "Open File"'),
      quit: () => alert('Triggered "Quit"'),
      cut: () => alert('Triggered "Cut"'),
      copy: () => alert('Triggered "Copy"'),
      paste: () => alert('Triggered "Paste"'),
      command1: () => alert('Triggered "Command One"'),
      command2: () => alert('Triggered "Command Two"'),
      showHotkeys: this.showDialog
    };

    let menu = [
      {
        text: "File",
        submenu: [
          {
            text: "New",
            icon: "add",
            tooltip: "May use tooltips",
            cmd: "newFile"
          },
          { text: "Open...", icon: "document", cmd: "openFile" },
          { divider: "" },
          { cmd: "showHotkeys" },
          { divider: "" },
          { icon: "log-out", cmd: "quit" } // no text prop here
        ]
      },
      {
        text: "Edit",
        submenu: [
          { icon: "cut", cmd: "cut" }, // no text props here
          { icon: "duplicate", disabled: true, cmd: "copy" },
          { icon: "clipboard", cmd: "paste" },
          { divider: "" },
          {
            text: "Other",
            submenu: [
              // no hotkeys or commands used here
              {
                text: "Some command 1",
                label: "Label",
                icon: "code",
                onClick: () => alert("Do something")
              },
              {
                text: "Some command 2",
                icon: "numerical",
                onClick: () => alert("Do something else")
              }
            ]
          }
        ]
      },
      {
        text: "No Submenu",
        onClick: () => alert("This triggers an action directly")
      }
    ];

    // Enhance menu with hotkeys and handlers, based on each item's `cmd` property
    this.menu = addMenuHotkeys(addMenuHandlers(menu, handlers), hotkeys);

    // Sets will normally be different routes/modules/views of an app, but any
    // arbitrary separation criteria will work
    this.hotkeySets = {
      "File Menu": hotkeys,
      "Other Section": {
        something: "alt+shift+s",
        somethingElse: "alt+shift+e"
      }
    };

    // An existing component may be wrapped, or a new one created, as in this case
    this.hotkeyEnabler = withHotkeys(hotkeys, handlers)();

    this.state = {
      showDialog: false
    };
  }

  showDialog() {
    this.setState({ showDialog: true });
  }

  hideDialog() {
    this.setState({ showDialog: false });
  }

  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: "#f8f8f8",
            height: "300px",
            border: "1px solid #eee"
          }}
        >
          <MenuBar menu={this.menu} />
        </div>
        <button
          onClick={e => {
            createMenu(
              [
                { text: "hey" },
                undefined,
                {
                  text: "you",
                  submenu: [
                    {
                      text: "yup",
                      willUnmount: () => {
                        console.log("hellllo");
                      },
                      didMount: ({ className }) => {
                        console.log("yaaa");
                      }
                    }
                  ]
                }
              ], //the "undefined" will be filtered out
              undefined,
              e,
              () => {
                console.log('closin')
              }
            );
          }}
        >
          Click to see a menu created using the imperative createMenu(menu,
          undefined, event)
        </button>
        <this.hotkeyEnabler />
        <HotkeysDialog
          hotkeySets={this.hotkeySets}
          isOpen={this.state.showDialog}
          onClose={this.hideDialog}
        />
        <br />
        <p>
          The <code>menu</code> prop must be an array of objects with{" "}
          <code>text</code> and
          <code>submenu</code> properties. Each <code>submenu</code> is itself
          an array of item descriptor objects or <code>MenuItem</code> elements.
          Item descriptors may contain several properties, namely{" "}
          <code>text</code>,
          <code>icon</code>, <code>label</code>, <code>hotkey</code>,{" "}
          <code>onClick</code>,
          <code>tooltip</code>, <code>key</code>, <code>divider</code>,{" "}
          <code>navTo</code>,
          <code>href</code>, <code>target</code> and <code>submenu</code>. You
          may also use the <code>cmd</code> property in combination with{" "}
          <code>addMenuHotkeys</code>
          and <code>addMenuHandlers</code>. Check the <code>createMenu()</code>{" "}
          util for more details.
        </p>
      </div>
    );
  }
}

render(<MenuBarDemo />);
