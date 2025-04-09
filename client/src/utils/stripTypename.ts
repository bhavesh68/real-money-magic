/**
 * Recursively removes __typename fields from any object or array.
 * Useful when sending data to GraphQL mutations to prevent schema conflicts.
 */
export const stripTypenameDeep = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(stripTypenameDeep);
    } else if (obj && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        if (key !== '__typename') {
          newObj[key] = stripTypenameDeep(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  };
  