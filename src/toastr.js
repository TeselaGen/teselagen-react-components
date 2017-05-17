import { Position, Toaster, Intent } from "@blueprintjs/core";

const TopToaster = Toaster.create({
  className: "top-toaster",
  position: Position.TOP
});

if (!window.toastr) window.toastr = {};
if (!window.toastr.success)
  window.toastr.success = function(message) {
    TopToaster.show({
      intent: Intent.SUCCESS,
      message
    });
  };

if (!window.toastr.error)
  window.toastr.error = function(message) {
    TopToaster.show({
      intent: Intent.DANGER,
      message
    });
  };

if (!window.toastr.warning)
  window.toastr.warning = function(message) {
    TopToaster.show({
      intent: Intent.WARNING,
      message
    });
  };

if (!window.toastr.info)
  window.toastr.info = function(message) {
    TopToaster.show({
      message
    });
  };

export default TopToaster;
