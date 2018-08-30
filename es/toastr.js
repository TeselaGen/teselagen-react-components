import { Position, Toaster, Intent } from "@blueprintjs/core";

var TopToaster = Toaster.create({
  className: "top-toaster",
  position: Position.TOP
});

var BottomToaster = Toaster.create({
  className: "bottom-toaster",
  position: Position.BOTTOM
});

var generateToast = function generateToast(intent) {
  return function (message, options) {
    options = options || {};
    var toastToUse = options.bottom ? BottomToaster : TopToaster;

    var uniqKey = toastToUse.show({
      intent: intent,
      message: message,
      action: options.action,
      icon: options.icon
    });
    return function clear() {
      toastToUse.dismiss(uniqKey);
    };
  };
};

function preventDuplicates(func) {
  var previousToasts = {};
  return function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (previousToasts[message]) {
      previousToasts[message](); //clear it!
    }

    setTimeout(function () {
      delete previousToasts[message];
    }, options.timeout || 5000);
    var clearToast = func(message, options);
    previousToasts[message] = clearToast;
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