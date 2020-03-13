export default function getTextFromEl(el, options = {}) {
  const { lowerCase } = options;

  return el.props && el.props.children
    ? (el.props.children.reduce
        ? el.props.children
        : [el.props.children]
      ).reduce((acc, child) => {
        if (child && child.props && child.props.children) {
          acc += getTextFromEl(child);
        } else if (typeof child === "string") {
          if (lowerCase) {
            acc += child.toLowerCase();
          } else {
            acc += child;
          }
        } else if (typeof child === "number") {
          acc += child + "";
        }
        return acc;
      }, "")
    : "";
}
