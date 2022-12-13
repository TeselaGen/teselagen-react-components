import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

let tippys = [];
(function() {
  let lastMouseOverElement = null;
  document.addEventListener("mouseover", function(event) {
    const element = event.target;

    if (element instanceof Element && element !== lastMouseOverElement) {
      lastMouseOverElement = element;

      const id = "tippyEllipsizedEl";
      let innerRun = false;
      const inner = (content, el) => {
        innerRun = true;
        document.querySelectorAll(`.${id}`).forEach(elem => {
          elem.classList.remove(id);
        });

        el.classList.add(id);
        const inst = tippy(`.${id}`, {
          content,
          delay: [0, 0],
          allowHTML: true
        });
        inst.forEach(i => {
          i.show();
        });
        tippys = [...tippys, ...inst];
        if (content === el.getAttribute("title")) {
          el.removeAttribute("title");
        }
      };
      const levels = 6;
      let dataTip;
      let el = element;
      for (let index = 0; index < levels; index++) {
        if (!el) continue;
        const style = window.getComputedStyle(el);
        const whiteSpace = style.getPropertyValue("white-space");
        const textOverflow = style.getPropertyValue("text-overflow");
        dataTip = el.getAttribute("data-tip");
        const isEllipsized =
          whiteSpace === "nowrap" && textOverflow === "ellipsis";

        if (dataTip) {
          inner(dataTip, el);
          continue;
        } else if (
          isEllipsized &&
          el.offsetWidth < el.scrollWidth - 4 && //the -4 is adding a teeny bit of tolerance to fix issues with the column headers getting tooltips even when fully visible
          !el.classList.contains("no-data-tip") &&
          el.textContent &&
          el.textContent?.trim?.().length !== 0
        ) {
          inner(el.textContent, el);
          continue;
        } else if (isEllipsized && el.offsetWidth >= el.scrollWidth) {
          // break; //tnr: i don't think we need this..
        }
        el = el.parentElement;
      }

      if (!innerRun) {
        //clear old tippys
        tippys.forEach(t => {
          t.destroy();
        });
        tippys = [];
      }
    }
  });
})();
