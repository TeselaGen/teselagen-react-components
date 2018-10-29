class Example extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isOpen: true
    };
  }

  handleChange() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    return (
      <div>
        <Button onClick={this.handleChange}> Open Resizable Dialog</Button>
        <br />
        <br />
        <ResizableDraggableDialog
          isOpen={this.state.isOpen}
          onClose={this.handleChange}
          height={300}
          width={300}
          title={"I'm Resizable and Draggable!"}
        >
          <div className={Classes.DIALOG_BODY}>
      I am a dialog
      <div style={{width: 250}}>with a bunch of stuff in it</div>
      {[1, 2, 3, 4, 5, 5, 6, 6, 77, 7, 12, 2, 34].map((num, i) => {
        return (
          <div key={i} style={{ height: 40, background: Math.random() }}>
            {num}
          </div>
        );
      })}
    </div>
        </ResizableDraggableDialog>
      </div>
    );
  }
}

render(Example);
