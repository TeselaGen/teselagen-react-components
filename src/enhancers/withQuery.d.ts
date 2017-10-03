interface IWithQuery {}
export default function withQuery(fragment: Object, options: {
  isPlural: Boolean, // Are we searching for 1 thing or many?
  queryName: String, // What the props come back on ( by default = modelName + 'Query')
  asFunction: Boolean, // If true, this gives you back a function you can call directly instead of a HOC
  asQueryObj: Boolean, // If true, this gives you back the gql query object aka gql`query myQuery () {}`
  idAs: String, // By default single record queries occur on an id. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
  getIdFromParams: Boolean, // Grab the id variable off the match.params object being passed in!
  showLoading: Boolean, // Show a loading spinner over the whole component while the data is loading
  showError: Boolean, // Default=true show an error message toastr if the an error occurs while loading the data
}){}