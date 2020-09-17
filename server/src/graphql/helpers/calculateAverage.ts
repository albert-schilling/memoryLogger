import { meanBy } from 'lodash'
import { TMemoryAverage, TMemoryStatusReduced } from '../../types'
import {
  stringifyObjectValues,
  numberizeObjectValues,
} from './objectModification'

export function recalculateSessionAverage(
  average: TMemoryAverage,
  memoryStatus: TMemoryStatusReduced
): TMemoryAverage {
  const newAverage = stringifyObjectValues(
    reCalculateAverge(
      numberizeObjectValues(memoryStatus) as Record<string, number>,
      numberizeObjectValues(average) as Record<string, number> & {
        number: number
      }
    ),
    ['number']
  )
  return newAverage as TMemoryAverage
}

type TAverage = Record<string, number> & { number: number }
/**
 * Function to calculate the average per `key` for any number of `objects` with identical keys in an `array`.
 */
export function calculateAverge(array: Record<string, number>[]): TAverage {
  const average: TAverage = { number: 0 }
  const keys: string[] = Object.keys(array[0])
  keys.forEach((key) => (average[key] = meanBy(array, (o) => Number(o[key]))))
  average.number = array.length
  return average
}

/**
 * Function to calculate the average per `key` for any number of `objects` with identical keys in an `array`.
 */
export function reCalculateAverge(
  object: Record<string, number>,
  average: TAverage
): TAverage {
  const newAverage = { ...average }

  Object.keys(average).forEach((key) => {
    if (key === 'number') {
      newAverage.number++
    } else {
      newAverage[key] =
        (newAverage[key] * newAverage.number + object[key]) /
        (newAverage.number + 1)
    }
  })
  return newAverage
}
