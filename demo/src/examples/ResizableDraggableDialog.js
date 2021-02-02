class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      randomInt: 20
    };
  }

  render() {
    const arrayOfLength = Array.from({ length: this.state.randomInt }, () =>
      Math.floor(Math.random() * 9)
    );
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({ isOpen: true });
            this.setState({
              randomInt: Math.floor(Math.random() * (20 - 5 + 1)) + 5
            });
          }}
        >
          Open Resizable Dialog
        </Button>
        {renderToggle({
            that: this,
            label: "Fixed Height and Width",
            type: "fixedHeightAndWidth"
          })}
        <br />
        <br />
        {this.state.isOpen && <ResizableDraggableDialog
          isOpen={true}
          onClose={() => {
            this.setState({ isOpen: false });
          }}
          {...(this.state.fixedHeightAndWidth
            ? {
                height: 300,
                width: 300
              }
            : {})}
          title={"I'm Resizable and Draggable!"}
        >
          <div className={Classes.DIALOG_BODY}>
            I am a dialog
            <div style={{ width: this.state.randomInt * 40 }}>with a bunch of stuff in it</div>
            {arrayOfLength.map((num, i) => {
              return (
                <div key={i} style={{ height: 40, background: Math.random() }}>
                  {num}
                </div>
              );
            })}
          </div>
        </ResizableDraggableDialog>}
      </div>
    );
  }
}

render(Example);
