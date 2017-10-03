export default function withUpsert(modelNameOrFragment: Object, options: {
  refetchQueries: [string], // - this is just the apollo option exposed on the top level
  invalidate: [string], // - array of model types to invalidate after the mutate
  mutationName: string, // - optional rename of the default upsert function withXXXX to whatever you want
  showError: boolean, // - default=true -- whether or not to show a default error message on failure
  asFunction: boolean, // - if true, this gives you back a function you can call directly instead of a HOC
  idAs: string, // - if not using a fragment, you get an id field back as default. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
  forceCreate: boolean, // - sometimes the thing you're creating won't have an id field (it might have a code or something else as its primary key). This lets you override the default behavior of updating if no id is found
  forceUpdate: boolean, // - sometimes the thing you're updating might have an id field. This lets you override that. This lets you override the default behavior of creating if an id is found
  extraMutateArgs: function| object, // function  - obj or function that returns obj to get passed to the actual mutation call
}){}