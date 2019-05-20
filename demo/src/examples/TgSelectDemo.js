class TgSelectDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // const {} = this.props;

    const { multi, val } = this.state;
    return (
      <div>
        Default:
        <br />
        <TgSelect
          onChange={val => {
            this.setState({ val });
          }}
          multi={multi}
          value={val}
          options={[
            { label: "hey", value: "1234" },
            {
              label: "there",
              value: "14556"
            },
            { label: "my", value: "122434" },
            { label: "friend", value: "127734" },
          ]}
        />
        {renderToggle({
          that: this,
          type: "multi"
          // type: "reactSelectFieldCreateable"
        })}
      </div>
    );
  }
}

render(TgSelectDemo);
