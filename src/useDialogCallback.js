import React, { useState } from "react";

export const useDialogCallback = ({ ModalComponent, ...rest }) => {
  const [isOpen, setOpen] = useState(false);
  const dialogComp = (
    <ModalComponent
      hideModal={() => {
        setOpen(false);
      }}
      dialogProps={{
        hideModal: () => {
          setOpen(false);
        },
        isOpen
      }}
      {...rest}
    ></ModalComponent>
  );
  const toggleDialog = () => {
    setOpen(!isOpen);
  };
  return [toggleDialog, dialogComp];
};
