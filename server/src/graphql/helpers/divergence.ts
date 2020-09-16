/**
 * Function that returns the divergence of an `object's` `values` from a given `average`.
 */
export function calculateDivergence(
  average: Record<string, number>,
  object: Record<string, number>
): Record<string, number> {
  const divergence = {}
  Object.keys(average).forEach((key) => {
    if (object.hasOwnProperty(key)) {
      Object.assign(divergence, { [key]: object[key] / average[key] })
    }
  })
  return divergence
}

/**
 * Function that returns the `values` of an `object` that surpasses a given `divergence limit`.
 */
export function getDivergentValues(
  divergence: Record<string, number>,
  limit: number
): Record<string, number> {
  const divergentValues = {}
  Object.keys(divergence).forEach((key) => {
    if (divergence[key] - 1 > limit) {
      Object.assign(divergentValues, { [key]: divergence[key] })
    }
  })
  return divergentValues
}
