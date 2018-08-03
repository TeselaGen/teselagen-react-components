import React from "react";
import Loading from "./Loading";
import { renderOnDocSimple } from "./utils/renderOnDoc";
import FillWindow from "./FillWindow";

export default function showLoadingMask(opts = {}) {
  return renderOnDocSimple(
    <div>
    <FillWindow containerStyle={{background: "grey", opacity: .5}}>
    </FillWindow>
    <FillWindow containerStyle={{opacity: 1, background: "none"}}>
      {({ width, height }) => {
        return (
          <div style={{ width, height }}>
            <Loading
              {...{
                displayInstantly: true,
                containerStyle: {
                  opacity: 1,
                  display: "flex",
                  justifyContent: "center"
                },
                ...opts
              }}
            />)
          </div>
        );
      }}
    </FillWindow>
    </div>

  );
}
