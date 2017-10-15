# Usage: 

withDialog()(YourComponent) wraps YourComponent in a blueprint Dialog! 

First hook up dialog to redux (only need to do this once): 

```js
//rootReducer.js
import {tg_modalState} from 'teselagen-react-components'

export default combineReducers({
  tg_modalState,
})
```

Use the component
```js
const DialogComp = withDialog({...bpDialogPropsHere})(MyComponent)
render() {
  return <DialogComp 
  dialogName={string} //optionally pass a UNIQUE dialog name to be used
  dialogProps={object} //optionally pass additional runtime blueprint dialog props here
  //all other props passed directly to wrapped component
  > 
  <Trigger/>
</DialogComp>
}
```



In RARE cases where you need to open the dialog programatically, make sure the dialog component is on the page (just don't pass a child component and nothing will appear to be added to the DOM), and call dispatch like:
```js
dispatch({
  type: "TG_SHOW_MODAL",
  name: dialogName //you'll need to pass a unique dialogName prop to the compoennt
  props:  // pass props to the wrapped component here :)
})
``` 