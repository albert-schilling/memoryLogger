import { stringifyObjectValues, numberizeObjectValues, removeKeys, removeKeysExcept } from "./objectModification"

describe('stringifyObjectValues', () => {
    it(' stringifies all values of an object except for the given keys in exceptions.', () => {
      const object = {
        number: 3,
        jsHeapSizeLimit: 4294705152,
        totalJSHeapSize: 37284233,
        usedJSHeapSize: 35701006.333333336,
      }
  
      const stringifiedObject = stringifyObjectValues(object, ['number'])
  
      expect(stringifiedObject).toEqual({
        number: 3,
        jsHeapSizeLimit: '4294705152',
        totalJSHeapSize: '37284233',
        usedJSHeapSize: '35701006.333333336',
      })
    })
  })
  
  describe('numberizeObjectValues', () => {
    it(' turns all values of an object into Numbers except for the given keys in exceptions.', () => {
      const object = {
        comment: 'WOW!',
        jsHeapSizeLimit: '4294705152',
        totalJSHeapSize: '37284233',
        usedJSHeapSize: '35701006.333333336',
      }
  
      const stringifiedObject = numberizeObjectValues(object, ['comment'])
  
      expect(stringifiedObject).toEqual({
        comment: 'WOW!',
        jsHeapSizeLimit: 4294705152,
        totalJSHeapSize: 37284233,
        usedJSHeapSize: 35701006.333333336,
      })
    })
  })
  
  describe('removeKeys', () => {
    const object = {
      A: 4,
      B: 5,
      C: 22,
      XYZ: 'text',
    }
  
    it('removes given keys from an object', () => {
      const newOject = removeKeys(object, ['XYZ'])
      expect(newOject).toEqual({
        A: 4,
        B: 5,
        C: 22,
      })
    })
  })

  describe('removeKeysExcept', () => {
    const object = {
      A: 4,
      B: 5,
      C: 22,
      XYZ: 'text',
    }
  
    it('removes given keys from an object', () => {
      const newOject = removeKeysExcept(object, ['A'])
      expect(newOject).toEqual({
        A: 4,
      })
    })
  })