function CustomIconsDemo() {
  return (
    <div>
      <h3>Instuctions for adding more icons:</h3>
      <h4>
        open `src/customIcons.js` and add a new exported svg with a name of
        xxxxIcon (you can find the svgs from iconmonstr or flaticon or wherever)
      </h4>
      <h4>
        be sure to add it to the `demo/src/examples/CustomIcons.js` page to TEST
        THAT IT WORKS and so that people know it exists!
      </h4>
      <Button icon={customIcons.flaskIcon} text="flaskIcon" />
      <Button icon={customIcons.orfIcon} text="orfIcon" />
      <Button icon={customIcons.featureIcon} text="featureIcon" />
      <Button icon={customIcons.dnaIcon} text="dnaIcon" />
      <Button icon={customIcons.workqueueIcon} text="workqueueIcon" />
      <Button icon={customIcons.inventoryIcon} text="inventoryIcon" />
      <Button icon={customIcons.workflowIcon} text="workflowIcon" />
      <Button icon={customIcons.strainIcon} text="strainIcon" />
      <Button icon={customIcons.designIcon} text="designIcon" />
      <Button icon={customIcons.moleculeIcon} text="moleculeIcon" />
      <Button icon={customIcons.keyboardIcon} text="keyboardIcon" />
    </div>
  );
}

render(CustomIconsDemo);
