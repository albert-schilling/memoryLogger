import {
  calculateAverge,
  reCalculateAverge,
  recalculateSessionAverage,
} from './calculateAverage'

describe('calculateAverage', () => {
  const array = [
    {
      jsHeapSizeLimit: 4294705152,
      totalJSHeapSize: 37284233,
      usedJSHeapSize: 35794965,
    },
    {
      jsHeapSizeLimit: 4294705152,
      totalJSHeapSize: 37284233,
      usedJSHeapSize: 36004229,
    },
    {
      jsHeapSizeLimit: 4294705152,
      totalJSHeapSize: 37284233,
      usedJSHeapSize: 35303825,
    },
  ]
  it('calculates the proper average', () => {
    const average = calculateAverge(array)
    expect(average).toEqual({
      number: 3,
      jsHeapSizeLimit: 4294705152,
      totalJSHeapSize: 37284233,
      usedJSHeapSize: 35701006.333333336,
    })
  })
})

describe('reCalculateAverage', () => {
  const object = {
    A: 4,
    B: 5,
    C: 22,
  }

  const currentAverage = {
    number: 3,
    A: 3,
    B: 6,
    C: 9,
  }

  it('recalculates the proper average', () => {
    const average = reCalculateAverge(object, currentAverage)
    expect(average).toEqual({
      number: 4,
      A: 3.2,
      B: 5.8,
      C: 11.6,
    })
  })
})

describe('recalculateSessionAverage', () => {
  const object = {
    clientTimestamp: '123843789',
    jsHeapSizeLimit: '4',
    totalJSHeapSize: '5',
    usedJSHeapSize: '22',
  }

  const currentAverage = {
    number: 3,
    clientTimestamp: '123830789',
    jsHeapSizeLimit: '3',
    totalJSHeapSize: '6',
    usedJSHeapSize: '9',
  }

  it('recalculates the proper average', () => {
    const average = recalculateSessionAverage(currentAverage, object)
    expect(average).toEqual({
      number: 4,
      clientTimestamp: "123833389",
      jsHeapSizeLimit: '3.2',
      totalJSHeapSize: '5.8',
      usedJSHeapSize: '11.6',
    })
  })
})

