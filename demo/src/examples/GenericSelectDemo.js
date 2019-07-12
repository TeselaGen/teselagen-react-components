const GenericSelect = createGenericSelect({ modelNameToReadableName });

class GenericSelectDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    
  }
  render() {
    // const {} = this.props;

    const { multi, val } = this.state;
    return (
      <ApolloProvider client={client} store={store}>
      
      <div>
        Default:
        <br />
        <GenericSelect
            name="growthCondition.growthMedia"
            asReactSelect={true}
            label="Growth Medium"
            schema={[
              {
                path: "name"
              }
            ]}
            fragment={["additiveMaterial", "id name"]}
            tableParamOptions={{
              additionalFilter: (props, qb) => {
                qb.whereAll({
                  additiveTypeCode: "GROWTH_MEDIA"
                });
              }
            }}
          // onChange={val => {
          //   this.setState({ val });
          // }}
          multi={multi}
          // value={val}
          // options={[
          //   { label: "hey", value: "1234" },
          //   {
          //     label: "there",
          //     value: "14556"
          //   },
          //   { label: "my", value: "122434" },
          //   { label: "friend", value: "127734" },
          // ]}
        />
        {renderToggle({
          that: this,
          type: "multi"
          // type: "reactSelectFieldCreateable"
        })}
      </div>
      </ApolloProvider>
    );
  }
}

const formWrapped = reduxForm({
  form: "genericSelectForm",
  // validate
})(GenericSelectDemo);

render(formWrapped);
