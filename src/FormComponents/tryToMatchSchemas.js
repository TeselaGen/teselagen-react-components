import { map } from "lodash";
import { nanoid } from "nanoid";
import Fuse from "fuse.js";
import { max } from "lodash";

const getSchema = data => ({
  fields: map(data[0], (val, path) => {
    return { path, type: "string" };
  }),
  userData: map(data, d => {
    if (!d.id) {
      return {
        ...d,
        id: nanoid()
      };
    }
    return d;
  })
});

export default function tryToMatchSchemas({
  incomingData,
  validateAgainstSchema
}) {
  const userSchema = getSchema(incomingData);
  const { searchResults, hasIssues } = matchSchemas(
    userSchema.fields,
    validateAgainstSchema.fields
  );

  const incomingHeadersToScores = {};

  searchResults.forEach(r => {
    r.matches.forEach(match => {
      incomingHeadersToScores[match.item.path] =
        incomingHeadersToScores[match.item.path] || [];
      incomingHeadersToScores[match.item.path].push(match.score);
    });
  });
  searchResults.forEach(r => {
    for (const match of r.matches) {
      if (!incomingHeadersToScores[match.item.path]) continue;
      const maxScore = max(incomingHeadersToScores[match.item.path]);
      if (maxScore === match.score) {
        r.topMatch = match.item.path;
        r.matches.forEach(match => {
          if (!incomingHeadersToScores[match.item.path]) return;
          const arr = incomingHeadersToScores[match.item.path];
          arr.splice(arr.indexOf(match.score), 1);
        });
        delete incomingHeadersToScores[match.item.path];
        break;
      }
    }
  });
  const initialMatchedHeaders = {};
  searchResults.forEach((r, i) => {
    if (r.topMatch) {
      initialMatchedHeaders[i] = r.topMatch;
    }
  });

  return {
    hasIssues,
    initialMatchedHeaders,
    userSchema,
    searchResults
  };
}

function matchSchemas(userSchema, officialSchema) {
  const options = {
    includeScore: true,
    keys: ["path", "displayName"]
  };
  let hasIssues = false;
  officialSchema.forEach(h => {
    let hasMatch = false;
    userSchema.forEach(uh => {
      if (uh.path.toLowerCase() === h.path.toLowerCase()) {
        hasMatch = true;
      }
    });
    if (!hasMatch) hasIssues = true;
  });
  if (!hasIssues) {
    return { hasIssues };
  }

  const fuse = new Fuse(userSchema, options);

  officialSchema.forEach(h => {
    const result = fuse.search(h.path);
    h.matches = result;
  });
  return { searchResults: officialSchema, hasIssues: true };
}
