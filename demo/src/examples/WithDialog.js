function DialogInner() {
  return (
    <div className={Classes.DIALOG_BODY}>
      I am a dialog
      <div>with a bunch of stuff in it</div>
      {[1, 2, 3, 4, 5, 5, 6, 6, 77, 7, 12, 2, 34].map((num, i) => {
        return (
          <div key={i} style={{ height: 40, background: Math.random() }}>
            {num}
          </div>
        );
      })}
    </div>
  );
}

class WithDialogDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDraggable: false
    };
  }

  render() {
    const { isDraggable } = this.state;
    const WithDialog = withDialog({ isDraggable, title: "Dialog Demo" })(
      DialogInner
    );
    return (
      <div>
        {renderToggle(this, "isDraggable", "Make dialog draggable and resizable")}
        <WithDialog>
          <Button text="Show Dialog" />
        </WithDialog>
      </div>
    );
  }
}

render(WithDialogDemo);
