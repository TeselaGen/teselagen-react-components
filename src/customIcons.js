import React from "react";

const ptIconWrapper = (path, viewboxDefault = 24) => {
  return (
    <svg
      class="pt-icon"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="16px"
      height="16px"
      viewBox={`0 0 ${viewboxDefault} ${viewboxDefault}`}
    >
      {path}
    </svg>
  );
};

export const flaskIcon = ptIconWrapper(
  <path
    d="M42.504,39.673L29.88,16.027V4.021h1.249c0.553,0,1-0.447,1-1V1c0-0.552-0.447-1-1-1H29.88H17.042h-1.144
c-0.553,0-1,0.448-1,1v2.021c0,0.553,0.447,1,1,1h1.144v12.007L5.421,39.57C2.451,44.226,4.519,48,10.042,48h27.999
C43.563,48,45.561,44.271,42.504,39.673z M20.628,17.798l0.413-0.837v-0.933V4.021h4.839v12.007v1.001l0.471,0.883l5.41,10.132
h-16.19L20.628,17.798z"
  />,
  48
);

// export const orfIcon = ptIconWrapper(<path transform="rotate(57.28718566894531 8.363667488098143,10.816314697265627) " id="svg_2" d="m-1.07883,9.82896c4.617,-4.618 12.056,-4.676 16.756,-0.195l2.129,-2.258l0,7.938l-7.484,0l2.066,-2.191c-2.819,-2.706 -7.297,-2.676 -10.074,0.1l-3.393,-3.394z"/>);
// export const orfIcon = ptIconWrapper(  <path stroke="null" transform="rotate(57.28718566894531 9.91405391693115,10.816313743591309) " id="svg_2" d="m-1.85643,9.34819c5.75529,-6.86663 15.02833,-6.95287 20.88708,-0.28995l2.65389,-3.35748l0,11.80323l-9.32913,0l2.57536,-3.25786c-3.51401,-4.02362 -9.09603,-3.97902 -12.55768,0.14869l-4.22952,-5.04663z"/>);
export const orfIcon = ptIconWrapper(<path d="M13 7v-6l11 11-11 11v-6h-13v-10z"/>);

export const featureIcon = ptIconWrapper(<path d="M17 5h-17v14h17l7-7z" />);
