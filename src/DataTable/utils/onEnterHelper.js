export default function onEnterHelper(callback) {
  //this is just
  return {
    onKeyDown: function(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    }
  };
}
