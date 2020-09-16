import { calculateAverge } from './calculateAverage'
import { removeKeysExcept, numberizeObjectValues } from './objectModification'
import { calculateDivergence } from './divergence'

/**
 * Function that returns the coefficients of a simple linear regression.
 * It takes an `array of ojects`, one `object key` used as x parameter and another `object key` used as y parameter
 * and returns an `object` containing the coefficients `shift` and `gradient`.
 */
export function simpleLinearRegression(
  array: Record<string, number | string>[],
  x: string,
  y: string
): { shift: number; gradient: number } {
  const cleanedArray = array.map(
    (object) =>
      (numberizeObjectValues(
        removeKeysExcept(object, [x, y])
      ) as unknown) as Record<string, number>
  )
  const average = calculateAverge(cleanedArray)
  const arrayWithDivergence = cleanedArray.map((object) => {
    return { ...object, divergence: calculateDivergence(average, object) }
  })
  const counter = arrayWithDivergence.reduce(
    (acc, curr) => curr.divergence[x] * curr.divergence[y] + acc,
    0
  )
  const denominator = arrayWithDivergence.reduce(
    (acc, curr) => curr.divergence[x] * curr.divergence[x] + acc,
    0
  )
  const gradient = counter / denominator
  const shift = average[y] - gradient * average[x]
  return { shift, gradient }
}
