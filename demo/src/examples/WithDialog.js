function DialogInner() {
  return <div className="pt-dialog-body">I am a dialog

    <div>with a bunch of stuff in it</div>
    {[1,2,3,4,5,5,6,6,77,7,12,2,34].map((num, i) => {
      return <div key={i} style={{height: 40, background: Math.random()}}>
        {num}
      </div>
    })}
  </div>;
}

const WithDialog = withDialog({ isDraggable: false, title: "Dialog Demo" })(DialogInner);

function WithDialogDemo() {
  return (
    <WithDialog>
      <Button text="Show Dialog" />
    </WithDialog>
  );
}

render(WithDialogDemo);
