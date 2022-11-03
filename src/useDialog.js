import React, { useState } from "react";

/* 

  const {toggleDialog, comp} = useDialog({
    ModalComponent: SimpleInsertData,
    validateAgainstSchema,
  });

  return <div>
    {comp} //stick the returned dialog comp somewhere in the dom! (it should not effect layout)
    {...your code here}
  </div>

*/
export const useDialog = ({ ModalComponent, ...rest }) => {
  const [isOpen, setOpen] = useState(false);
  const [additionalProps, setAdditionalProps] = useState(false);
  console.log(`additionalProps`, additionalProps)
  console.log(`isOpen:`, isOpen);
  console.log(`rest,:`,rest,)
  const comp = (
    <ModalComponent
      hideModal={() => {
        setOpen(false);
      }}
      dialogProps={{
        isOpen,
        ...rest?.dialogProps,
        ...additionalProps?.dialogProps
      }}
      {...rest}
      {...additionalProps}
    ></ModalComponent>
  );
  const toggleDialog = () => {
    setOpen(!isOpen);
  };
  async function showDialogPromise(handlerName, moreProps = {}) {
    return new Promise(resolve => {
      //return a promise that can be awaited
      setAdditionalProps({
        hideModal: () => {
          //override hideModal to resolve also
          setOpen(false);
          resolve({});
        },
        [handlerName]: r => {
          setOpen(false);
          resolve(r || {});
        },
        //pass any additional props to the dialog
        ...moreProps
      });
      setOpen(true); //open the dialog
    });
  }
  return { comp, showDialogPromise, toggleDialog, setAdditionalProps };
};
