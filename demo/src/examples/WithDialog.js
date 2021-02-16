import { Button, Classes } from '@blueprintjs/core';
import React from 'react'
import { Provider,  } from 'react-redux';
import withDialog from '../../../src/enhancers/withDialog';
import store from '../store';
import renderToggle from '../renderToggle';

function DialogInner(p) {
  return (
    <div className={Classes.DIALOG_BODY}>
      I am a dialog
      <div style={{ width: 450 }}>with a bunch of stuff in it</div>
      {[1, 2, 3, 4, 5, 5, 6, 6, 77, 7, 12, 2, 34].map((num, i) => {
        return (
          <div key={i} style={{ height: 40, background: Math.random() }}>
            {num}
            {p && p.prop1}
          </div>
        );
      })}
    </div>
  );
}

const ProgramaticDialog = withDialog({
  dialogName: "programaticDialog",
  title: "Programatic Dialog Demo"
})(DialogInner);

export default class WithDialogDemo extends React.Component {
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
      <Provider store={store}>
        <div>
          {renderToggle({
            that: this,
            type: "isDraggable",
            description: "Make dialog draggable and resizable"
          })}
          <Button
            onClick={() => {
              store.dispatch({
                type: "TG_SHOW_MODAL",
                name: "programaticDialog", //you'll need to pass a unique dialogName prop to the compoennt
                props: {
                  prop1: "I'm a Programatic Dialog!"
                } // pass props to the wrapped component here :)
              });
            }}
          >
            Show Programatic Dialog (via redux)
          </Button>
          <WithDialog>
            <Button text="Show Dialog" />
          </WithDialog>
          <ProgramaticDialog></ProgramaticDialog>
        </div>
      </Provider>
    );
  }
}

