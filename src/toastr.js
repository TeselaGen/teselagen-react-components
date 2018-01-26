import { Position, Toaster, Intent } from "@blueprintjs/core";

const TopToaster = Toaster.create({
  className: "top-toaster",
  position: Position.TOP
});

const BottomToaster = Toaster.create({
  className: "bottom-toaster",
  position: Position.BOTTOM
});

const generateToast = intent => (message, options) => {
  options = options || {};
  const toastToUse = options.bottom ? BottomToaster : TopToaster;
  toastToUse.show({
    intent,
    message
  });
};

if (!window.toastr) window.toastr = {};
if (!window.toastr.success) {
  window.toastr.success = generateToast(Intent.SUCCESS);
}

if (!window.toastr.error) {
  window.toastr.error = generateToast(Intent.DANGER);
}

if (!window.toastr.warning) {
  window.toastr.warning = generateToast(Intent.WARNING);
}

if (!window.toastr.info) {
  window.toastr.info = generateToast(Intent.PRIMARY);
}
