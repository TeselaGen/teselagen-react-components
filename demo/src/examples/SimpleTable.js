const schema = {
  fields: [
    { path: "name" },
    {
      path: "id",
      type: "action",
      render: () => {
        return <Button minimal icon="circle" />;
      }
    }
  ]
};

const entities = [
  {
    name: "Thomas",
    id: "1"
  },
  {
    name: "Taoh",
    id: "2"
  },
  {
    name: "Chris",
    id: "3"
  },
  {
    name: "Sam",
    id: "4"
  },
  {
    name: "Adam",
    id: "5"
  }
];

function SimpleTable() {
  return (
    <DataTable
      formName="simpleTable"
      isSimple
      entities={entities}
      schema={schema}
    >
      <div>hey</div>
    </DataTable>
  );
}

render(<SimpleTable />);
