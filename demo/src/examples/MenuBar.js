class MenuBarDemo extends React.Component {
  constructor(props) {
    super(props);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);

    // This can be (re)used for hotkey handling, top menu clicks, context menu
    // clicks, etc.
    const commandDefs = {
      cmdSubmenu: {
        preventDefault: true,
        hotkey: "mod+n",
        text: "cmdSubmenu",
        submenu: props => {
          return [
            {
              text: "yay I'm a dynamic submenu",
              onClick: () => {}
            }
          ];
        },
        handler: () => alert('Triggered "New File"')
      },
      newFile: {
        preventDefault: true,
        hotkey: "mod+n",
        handler: () => alert('Triggered "New File"')
      },
      fakeCmd1: {
        handler: () => alert("Triggering Fake Cmd"),
        name: () => {
          return "Fake Cmd";
        }
      },
      fakeCmd2: {
        handler: () => alert("Triggering Fake Cmd 2"),
        name: () => {
          return "Fake Cmd 2";
        }
      },
      openFile: {
        isDisabled: () => {
          return "yep I'm disabled";
        },
        preventDefault: true,
        hotkey: "mod+n",
        handler: () => alert('Triggered "Open File"')
      },
      quit: { hotkey: "mod+n", handler: () => alert('Triggered "Quit"') },
      cut: { hotkey: "mod+n", handler: () => alert('Triggered "Cut"') },
      copy: { hotkey: "mod+n", handler: () => alert('Triggered "Copy"') },
      paste: { hotkey: "mod+n", handler: () => alert('Triggered "Paste"') },
      command1: {
        hotkey: "mod+n",
        handler: () => alert('Triggered "Command One"')
      },
      command2: {
        hotkey: "mod+n",
        handler: () => alert('Triggered "Command Two"')
      },
      showHotkeys: { hotkey: "mod+n", handler: this.showDialog }
    };

    // Create commands without any special logic
    const commands = genericCommandFactory({
      commandDefs,
      getArguments: () => [],
      handleReturn: () => {}
    });
    this.commands = commands;

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
          {
            text: <span>ReactText {9}</span>,
            onClick: () => {
              window.toastr.success("Fired ReactText!");
            },
            submenu: [
              {
                text: "hello!!",
                onClick: () => {
                  window.toastr.success("hello!");
                }
              },
              "cmdSubmenu"
            ]
          },
          "cmdSubmenu",
          {
            shouldDismissPopover: false,
            text: (
              <span>
                Long React El Text <input /> <span> Text</span>{" "}
                <span>Other Text </span>
              </span>
            ),
            onClick: () => {}
          },
          { text: "Open...", icon: "document", cmd: "openFile" },
          { divider: "" },
          { cmd: "showHotkeys" },
          {
            cmd: "fakeCmd1"
          },
          { divider: "" },
          { icon: "log-out", cmd: "quit" } // no text prop here
        ]
      },
      {
        text: "Edit",
        submenu: [
          { icon: "cut", cmd: "cut" }, // no text props here
          {
            icon: "duplicate",
            disabled:
              "Hey I'm a tooltip created by passing a string to disabled:''",
            cmd: "copy"
          },
          { icon: "clipboard", cmd: "paste" },
          { divider: "" },
          {
            text: "Other",
            submenu: [
              // no hotkeys or commands used here
              {
                text: "Not a command",
                label: "Label",
                icon: "code",
                onClick: () => {
                  console.info("h");
                }
              },
              {
                text: "Some command 1",
                label: "Label",
                icon: "code",
                cmd: "command1",
                onClick: () => alert("Do something") //this should override the cmd
              },
              {
                text: "Some command 2",
                icon: "numerical",
                cmd: "command2"
                // onClick: () => alert("Do something else")
              }
            ]
          }
        ]
      },
      {
        text: "No Submenu",
        onClick: () => alert("This triggers an action directly")
      },
      {
        text: "Help",
        submenu: [
          { isMenuSearch: true },
          {
            text: "About",
            hideFromMenuSearch: true,
            onClick: () => {
              window.toastr.success("About clicked");
            }
          },
          {
            text: "App Info",
            hideFromMenuSearch: true,
            onClick: () => {
              window.toastr.success("App Info clicked");
            }
          }
        ]
      }
    ];

    // Sets will normally be different routes/modules/views of an app, but any
    // arbitrary separation criteria will work
    this.hotkeySets = {
      // "File Menu": reduce(commandDefs, (acc, ) => {}, {}),
      "Other Section": {
        something: "alt+shift+s",
        somethingElse: "alt+shift+e"
      }
    };

    // An existing component may be wrapped, or a new one created, as in this case
    this.hotkeyEnabler = withHotkeys(
      getCommandHotkeys(commands), // in this example, equivalent to `hotkeys`,
      getCommandHotkeyHandlers(commands) // in this example, equivalent to `handlers`
    )();

    this.menu = menu;
    this.menuEnhancers = [commandMenuEnhancer(commands)];

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
            // backgroundColor: "#f8f8f8",
            height: "300px",
            border: "1px solid #eee"
          }}
        >
          <MenuBar menu={this.menu} enhancers={this.menuEnhancers} />
        </div>
        <button
          onClick={e => {
            showContextMenu(
              [
                { text: "hey" },
                undefined,
                {
                  text: "you",
                  submenu: [
                    {
                      text: "yup",
                      willUnmount: () => {
                        console.info("hellllo");
                      },
                      didMount: ({ className }) => {
                        console.info("yaaa");
                      }
                    }
                  ]
                }
              ], //the "undefined" will be filtered out
              undefined,
              e,
              () => {
                console.info("closin");
              }
            );
          }}
        >
          Click to see a menu created using the imperative showContextMenu(menu,
          undefined, event)
        </button>
        <h3>Examples of using CmdCheckbox, CmdSwitch, CmdDiv, CmdButton</h3>
        <CmdCheckbox cmd={this.commands.fakeCmd1} />
        <CmdSwitch cmd={this.commands.fakeCmd1} />
        <CmdDiv cmd={this.commands.fakeCmd2} />
        <CmdButton cmd={this.commands.fakeCmd2} />
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
          <code>text</code>,<code>icon</code>, <code>label</code>,{" "}
          <code>hotkey</code>, <code>onClick</code>,<code>tooltip</code>,{" "}
          <code>key</code>, <code>divider</code>, <code>navTo</code>,
          <code>href</code>, <code>target</code> and <code>submenu</code>. You
          may also include custom fields and have custom menu enhancers derive
          other props from them. For example, the <code>cmd</code> property can
          be used in combination with the <code>commandMenuEnhancer</code> to
          link menu items with commands, wiring not only the handler, but also
          the hotkeys, icon, disabled and active states, name, etc. Check the{" "}
          <code>DynamicMenuItem</code> component and
          <code>commandMenuEnhancer()</code> util for more details.
        </p>
      </div>
    );
  }
}

render(<MenuBarDemo />);
