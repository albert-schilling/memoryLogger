import { TUnknownObject } from "../../types"

/**
 * Function to stringify all values of an `object` except for the given keys in `exceptions`.
 */
export function stringifyObjectValues(
    object: TUnknownObject,
    exceptions?: string[]
  ): TUnknownObject | Record<string, number> {
    const changedObject = { ...object }
    Object.keys(object).forEach((key) => {
      if (exceptions?.includes(key)) {
        return
      } else {
        changedObject[key] = String(changedObject[key])
      }
    })
    if (exceptions === undefined) {
      return changedObject as Record<string, number>
    } else return changedObject as TUnknownObject
  }
  
  /**
   * Function to parse all values of an `object` into a number except for the given keys in `exceptions`.
   */
  export function numberizeObjectValues(
    object: Record<string, unknown>,
    exceptions?: string[]
  ): Record<string, number | unknown> {
    const changedObject = { ...object }
    Object.keys(object).forEach((key) => {
      if (exceptions?.includes(key)) {
        return
      } else {
        changedObject[key] = Number(changedObject[key])
      }
    })
    if (exceptions === undefined) {
      return changedObject as Record<string, number>
    }
    return changedObject as TUnknownObject
  }
  
  /**
   * Function that removes given `keys` from a copied `object` and returns the new `object`.
   */
  export function removeKeys(
    object: TUnknownObject,
    deletions?: string[]
  ): TUnknownObject {
    const changedObject = { ...object }
    deletions?.forEach((key) => delete changedObject[key])
    return changedObject
  }
  
  /**
   * Function that removes all properties from a copied `object` except the given keys and returns the new `object`.
   */
  export function removeKeysExcept(
    object: TUnknownObject,
    exceptions?: string[]
  ): TUnknownObject {
    const changedObject = { ...object }
    Object.keys(changedObject).forEach((key) => {
      if (exceptions?.includes(key)) return
      delete changedObject[key]
    })
    return changedObject
  }
  