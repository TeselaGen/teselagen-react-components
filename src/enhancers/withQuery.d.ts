import {OperationOption, QueryProps} from 'react-apollo'

export declare interface IWithQuery<TProps, TResult> extends OperationOption {
  isPlural: boolean, // Are we searching for 1 thing or many?
  queryName: string, // What the props come back on ( by default = modelName + 'Query')
  asFunction: boolean, // If true, this gives you back a function you can call directly instead of a HOC
  asQueryObj: boolean, // If true, this gives you back the gql query object aka gql`query myQuery () {}`
  idAs: string, // By default single record queries occur on an id. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
  getIdFromParams: boolean, // Grab the id variable off the match.params object being passed in!
  showLoading: boolean, // Show a loading spinner over the whole component while the data is loading
  showError: boolean, // Default=true show an error message toastr if the an error occurs while loading the data
}

export default function withQuery(fragment: Object, options: IWithQuery ){}

