function Dialog() {
  return <div className="pt-dialog-body">I am a dialog</div>;
}

const WithDialog = withDialog({ title: "Dialog Demo" })(Dialog);

function WithDialogDemo() {
  return (
    <WithDialog>
      <Button text="Show Dialog" />
    </WithDialog>
  );
}

render(WithDialogDemo);
