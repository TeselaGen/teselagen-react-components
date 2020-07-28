class TgSelectDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // const {} = this.props;

    const { multi, isTagSelect, val, creatable, hasError } = this.state;

    return (
      <div>
        Default:
        <br />
        <TgSelect
          onChange={val => {
            this.setState({ val });
          }}
          isTagSelect={isTagSelect}
          multi={multi || isTagSelect}
          intent={hasError ? "danger" : ""}
          creatable={creatable}
          value={val}
          options={[
            {
              color: "red",
              label: (
                <span>
                  hey <div>I'm some texttt</div> <Icon icon="circle"></Icon>
                </span>
              ),
              value: "123y4"
            },
            { color: "green", label: "hey", value: "as1234" },
            {
              color: "yellow",
              label: "there",
              value: "14556"
            },
            { color: "blue", label: "my", value: "122434" },
            { color: "orange", label: "friend", value: "12rr7734" },
            { color: "white", label: "friend", value: "12773asd4" }
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
        {renderToggle({
          that: this,
          type: "isTagSelect",
          label: "isTagSelect   *Note: isTagSelect requires isMulti to be true"
          // type: "reactSelectFieldcreatable"
        })}
      </div>
    );
  }
}

render(TgSelectDemo);
