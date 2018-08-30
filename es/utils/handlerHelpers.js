export function onEnterHelper(callback) {
  return {
    onKeyDown: function onKeyDown(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    }
  };
}

export function onBlurHelper(callback) {
  return {
    onBlur: function onBlur(event) {
      callback(event);
    }
  };
}

export function onEnterOrBlurHelper(callback) {
  return {
    onKeyDown: function onKeyDown(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    },
    onBlur: function onBlur(event) {
      callback(event);
    }
  };
}