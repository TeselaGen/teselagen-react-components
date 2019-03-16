<FillWindow>
  {size => {
    console.info("size:", size);
    return (
      <div>
        window size: height: {size.height}
        width: {size.width}
        hey!
      </div>
    );
  }}
</FillWindow>;
