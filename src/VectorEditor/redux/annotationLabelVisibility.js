import { visibilityInitialValues } from "./annotationVisibility";

//./caretPosition.js
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";

// ------------------------------------
// Actions
// ------------------------------------
export const annotationLabelVisibilityToggle = createAction(
  "annotationLabelVisibilityToggle"
);

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [annotationLabelVisibilityToggle]: (state, payload) => {
      // remove plural 's' and add Labels (sequences => sequenceLabels)
      const namedLabel = payload.slice(0, -1) + "Labels";
      return {
        ...state,
        [namedLabel]: !state[namedLabel]
      };
    }
  },
  visibilityInitialValues
);
