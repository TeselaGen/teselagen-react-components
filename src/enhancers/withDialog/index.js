import { compose } from "redux";
import React from "react";
import { Dialog } from "@blueprintjs/core";
import { connect } from "react-redux";
import { lifecycle } from "recompose";
import { uniqueId } from "lodash";

/**
 * usage:
 * in container:
 * compose(
 *   withDialog({ title: "Select Aliquot(s) From", other bp dialog props here  })
 * )
 * 
 * in react component
 * import MyDialogEnhancedComponent from "./MyDialogEnhancedComponent"
 * 
 * render() {
 *  return <div>
 *    <MyDialogEnhancedComponent
 *      dialogProps={} //bp dialog overrides can go here
 *      dialogName={string} **OPTIONAL** a unique dialog name can optionally be passed
 *      target={<button>Open Dialog</button> } //target can also be passed as a child component 
 *      myRandomProp={'yuppp'} //pass any other props like normal to the component
 *      
 *    />
 *  </div>
 * }
 */
export default function withDialog(topLevelDialogProps) {
  function dialogHoc(WrappedComponent) {
    return class DialogWrapper extends React.Component {
      componentWillUnmount() {
        const { dispatch, dialogName } = this.props;
        if (dialogName) {
          dispatch({
            type: "TG_UNREGISTER_MODAL",
            name: dialogName
          });
        }
      }
      render() {
        const {
          target,
          noTarget,
          isDialogOpen,
          showModal,
          onClickRename,
          hideModal,
          children,
          dialogProps,
          title,
          alreadyRendering,
          ...rest
        } = this.props;
        const targetEl = target || children;
        if (!targetEl && !noTarget)
          throw new Error(
            "withDialog error: Please provide a target or child element to the withDialog() enhanced component. If you really don't want a target, please pass a 'noTarget=true' prop"
          );
        return (
          <div>
            {isDialogOpen && (
              <Dialog
                onClose={function() {
                  hideModal();
                }}
                title={title}
                isOpen={isDialogOpen}
                {...topLevelDialogProps}
                {...dialogProps}
              >
                <WrappedComponent
                  {...{
                    ...rest,
                    hideModal
                  }}
                />
              </Dialog>
            )}
            {targetEl &&
              React.cloneElement(targetEl, {
                [onClickRename || "onClick"]: () => {
                  showModal();
                }
              })}
          </div>
        );
      }
    };
  }

  return compose(
    connect(({ tg_modalState }) => {
      return { tg_modalState };
    }),
    lifecycle({
      componentWillMount: function() {
        const { dispatch, dialogName } = this.props;
        const uniqueName = uniqueId();
        const nameToUse = dialogName || uniqueName;
        this.setState({
          nameToUse,
          uniqueName
        });
        if (dialogName) {
          dispatch({
            type: "TG_REGISTER_MODAL",
            name: dialogName,
            uniqueName
          });
        }
      }
    }),
    connect(
      function({ tg_modalState }, { nameToUse, uniqueName }) {
        const dialogState = tg_modalState[nameToUse] || {};
        const { open, __registeredAs, ...rest } = dialogState;

        const newProps = {
          ...rest,
          isDialogOpen:
            open &&
            (__registeredAs
              ? Object.keys(__registeredAs)[0] === uniqueName
              : true)
        };
        return newProps;
      },
      function(dispatch, { nameToUse }) {
        return {
          showModal: function() {
            dispatch({
              type: "TG_SHOW_MODAL",
              name: nameToUse
            });
          },
          hideModal: function() {
            dispatch({
              type: "TG_HIDE_MODAL",
              name: nameToUse
            });
          }
        };
      }
    ),
    dialogHoc
  );
}
