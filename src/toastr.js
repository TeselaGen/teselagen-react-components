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

  const uniqKey = toastToUse.show(
    {
      intent,
      message,
      timeout: options.timeout,
      action: options.action,
      icon: options.icon
    },
    options.key
  );
  function clear() {
    toastToUse.dismiss(uniqKey);
  }
  clear.key = uniqKey;
  return clear;
};

function preventDuplicates(func) {
  const previousToasts = {};
  return (message, options = {}) => {
    const clearToast = func(message, options);
    // no duplicate check for toasts with updates
    if (!options.key) {
      if (!options.key && previousToasts[message]) {
        previousToasts[message](); //clear it!
      }

      setTimeout(() => {
        delete previousToasts[message];
      }, options.timeout || 5000);

      previousToasts[message] = clearToast;
    }
    return clearToast;
  };
}

if (!window.toastr) window.toastr = {};
if (!window.toastr.success) {
  window.toastr.success = preventDuplicates(generateToast(Intent.SUCCESS));
}

if (!window.toastr.error) {
  window.toastr.error = preventDuplicates(generateToast(Intent.DANGER));
}

if (!window.toastr.warning) {
  window.toastr.warning = preventDuplicates(generateToast(Intent.WARNING));
}

if (!window.toastr.info) {
  window.toastr.info = preventDuplicates(generateToast(Intent.PRIMARY));
}

if (!window.toastr.default) {
  window.toastr.default = preventDuplicates(generateToast(Intent.NONE));
}
