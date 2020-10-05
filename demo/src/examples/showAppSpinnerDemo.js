function Demo() {
  return (
    <div>
      <Button
        onClick={async function handleClick() {
          const closeAppSpinner = showAppSpinner();
          setTimeout(() => {
            closeAppSpinner()
          }, 2000);
        }}
        text="Show the app spinner"
      />
    </div>
  );
}

render(Demo);
