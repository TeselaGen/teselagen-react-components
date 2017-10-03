export default function withDelete(nameOrFragment: String | Object, {
  refetchQueries: [String],
  mutationName: String,
  extraMutateArgs: Function | Object,
  showError: Boolean,
  invalidate: [String],
  asFunction: Boolean,
}){}