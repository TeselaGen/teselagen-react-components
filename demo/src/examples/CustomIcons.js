function CustomIconsDemo() {
  return (
    <div>
      <h3>Instuctions for adding more icons:</h3> 
      <h4>open `src/customIcons.js` and add a new exported svg with a name of xxxxIcon (you can find the svgs from iconmonstr or flaticon or wherever)</h4>
      <h4>
        be sure to add it to the `demo/src/examples/CustomIcons.js` page to TEST
        THAT IT WORKS and so that people know it exists!
      </h4>
      <Button icon={customIcons.flaskIcon} text="flaskIcon" />
      <Button icon={customIcons.orfIcon} text="orfIcon" />
      <Button icon={customIcons.featureIcon} text="featureIcon" />
    </div>
  );
}

render(CustomIconsDemo);
