import React from 'react'

export default function CSSOnlyToolTip() {
  return (
    <div>
      <h3>See https://kazzkiq.github.io/balloon.css/ for more examples</h3>

      <button aria-label="Whats up!" data-balloon-pos="up">Hover me!</button>
      <button aria-label="Whats up!" data-balloon-pos="down">Hover me!</button>
    </div>
  );
}
