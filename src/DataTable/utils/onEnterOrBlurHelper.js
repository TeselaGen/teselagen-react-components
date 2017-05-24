export function onEnterHelper(callback) {
  //this is just
  return {
    onKeyDown: function(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    }
  };
}

export function onBlurHelper(callback) {
  //this is just
  return {
    onBlur: function(event) {
      callback(event);
    }
  };
}

export default function onEnterOrBlurHelper(callback) {
  return {
    onKeyDown: function(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    },
    onBlur: function(event) {
      callback(event);
    }
  };
}
