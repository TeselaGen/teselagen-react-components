export default function withDelete(nameOrFragment: string | object, options: {
  refetchQueries: [string],
  mutationName: string,
  extraMutateArgs: function | object,
  showError: boolean,
  invalidate: [string],
  asFunction: boolean,
}){}