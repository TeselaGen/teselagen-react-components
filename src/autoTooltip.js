import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

(function() {
  let lastMouseOverElement = null;
  document.addEventListener("mouseover", function(event) {
    const element = event.target;
    if (element instanceof Element && element !== lastMouseOverElement) {
      lastMouseOverElement = element;
      const style = window.getComputedStyle(element);
      const whiteSpace = style.getPropertyValue("white-space");
      const textOverflow = style.getPropertyValue("text-overflow");

      const id = "tippyEllipsizedEl";
      const inner = (content, el) => {
        document.querySelectorAll(`.${id}`).forEach(elem => {
          elem.classList.remove(id);
        });
        el.classList.add(id);

        tippy(`.${id}`, {
          content: content
        });
        if (content === el.getAttribute("title")) {
          el.removeAttribute("title");
        }
      };
      const levels = 6;
      let dataTip;
      let el = element;
      for (let index = 0; index < levels; index++) {
        if (!el) continue;
        dataTip = el.getAttribute("data-tip");
        if (dataTip) continue;
        el = element.parentElement;
      }
      if (dataTip) {
        inner(dataTip, el);
      } else if (
        whiteSpace === "nowrap" &&
        textOverflow === "ellipsis" &&
        element.offsetWidth < element.scrollWidth
      ) {
        inner(element.textContent, element);
      }
    }
  });
})();
