class TgSelectDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // const {} = this.props;

    const { multi, val, creatable, hasError } = this.state;

    return (
      <div>
        Default:
        <br />
        <TgSelect
          onChange={val => {
            this.setState({ val });
          }}
          multi={multi}
          intent={hasError ? "danger" : ""}
          creatable={creatable}
          value={val}
          options={[
            { label: <span>hey <div>I'm some texttt</div> <Icon icon="circle"></Icon></span>, value: "1234" },
            { label: "hey", value: "1234" },
            {
              label: "there",
              value: "14556"
            },
            { label: "my", value: "122434" },
            { label: "friend", value: "127734" }
          ]}
        />
        {renderToggle({
          that: this,
          type: "multi"
          // type: "reactSelectFieldcreatable"
        })}
        {renderToggle({
          that: this,
          type: "hasError"
          // type: "reactSelectFieldcreatable"
        })}
        {renderToggle({
          that: this,
          type: "creatable"
          // type: "reactSelectFieldcreatable"
        })}
      </div>
    );
  }
}

render(TgSelectDemo);
