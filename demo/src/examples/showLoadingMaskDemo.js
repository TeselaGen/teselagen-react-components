function Demo() {
  return (
    <div>
      showLoadingMask() is an imperative way to add a loading mask to the page
      <Button
        onClick={()=> {
          const close =  showLoadingMask();
          setTimeout(() => {
            close()
          }, 3000);
        }}
        text="Show the Loading Mask"
      />
    </div>
  );
}

render(Demo);
