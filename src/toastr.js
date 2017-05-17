import { Position, Toaster, Intent } from "@blueprintjs/core";

const TopToaster = Toaster.create({
  className: "top-toaster",
  position: Position.TOP
});

const BottomToaster = Toaster.create({
  className: "bottom-toaster",
  position: Position.BOTTOM
});

if (!window.toastr) window.toastr = {};
if (!window.toastr.success)
  window.toastr.success = function(message, options) {
    options = options || {};
    var toastToUse = options.bottom ? BottomToaster : TopToaster;
    toastToUse.show({
      intent: Intent.SUCCESS,
      message
    });
  };

if (!window.toastr.error)
  window.toastr.error = function(message, options) {
    options = options || {};
    var toastToUse = options.bottom ? BottomToaster : TopToaster;
    toastToUse.show({
      intent: Intent.DANGER,
      message
    });
  };

if (!window.toastr.warning)
  window.toastr.warning = function(message, options) {
    options = options || {};
    var toastToUse = options.bottom ? BottomToaster : TopToaster;
    toastToUse.show({
      intent: Intent.WARNING,
      message
    });
  };

if (!window.toastr.info)
  window.toastr.info = function(message, options) {
    options = options || {};
    var toastToUse = options.bottom ? BottomToaster : TopToaster;
    toastToUse.show({
      message
    });
  };

export default TopToaster;
