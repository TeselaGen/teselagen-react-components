export default function withDelete(nameOrFragment: String | Object, options: {
  refetchQueries: [String],
  mutationName: String,
  extraMutateArgs: Function | Object,
  showError: Boolean,
  invalidate: [String],
  asFunction: Boolean,
}){}