class Example extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      items: [
        { id: 0, label: "item 1 really long label aghaahahahahahah" },
        { id: 2, label: "item 2", disabled: true },
        { id: 3, label: "item 3", disabled: false },
        { id: 4, label: "item 4" }
      ],
      selectedItems: []
    };
  }

  handleChange(selectedItems) {
    this.setState({ selectedItems });
  }
  render() {
    const { items, selectedItems } = this.state;
    return (
      <div>
        Adapted from{" "}
        <a href="https://github.com/kenshoo/react-multi-select">
          https://github.com/kenshoo/react-multi-select{" "}
        </a>
        <br />
        <br />
        <br />
        Change set:{" "}
        <HTMLSelect
          onChange={e => {
            if (e.target.value === "set1") {
              this.setState({
                items: [
                  { id: 0, label: "item 1" },
                  { id: 2, label: "item 2", disabled: true },
                  { id: 3, label: "item 3", disabled: false },
                  { id: 4, label: "item 4" }
                ]
              });
            } else {
              this.setState({
                items: [
                  { id: 5, label: "item 5" },
                  { id: 6, label: "item 6" },
                  { id: 7, label: "item 7" },
                  { id: 8, label: "item 8" }
                ]
              });
            }
          }}
          options={["set1", "set2"]}
        />
        <br />
        <br />
        {/* <MultiSelectSideBySide
          items={items}
          selectedItems={selectedItems}
          onChange={this.handleChange}
        /> */}
      </div>
    );
  }
}

render(Example);
