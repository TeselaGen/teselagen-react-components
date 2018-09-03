<FillWindow>
  {size => {
    console.log("size:", size);
    return (
      <div>
        window size: height: {size.height}
        width: {size.width}
        hey!
      </div>
    );
  }}
</FillWindow>;
