import { calculateDivergence, getDivergentValues } from "./divergence"

describe('calculateDivergence', () => {
    const object = {
      A: 4,
      B: 5,
      C: 22,
    }
  
    const average = {
      number: 3,
      A: 3,
      B: 6,
      C: 9,
    }
  
    it('recalculates the proper average', () => {
      const divergence = calculateDivergence(average, object)
      expect(divergence).toEqual({
        A: (4 /3),
        B: (5 / 6),
        C: (22 / 9),
      })
    })
  })
  

describe('getDivergentValues', () => {
    const divergence = {
        A: (1.1 / 1),
        B: (5 / 6),
        C: (22 / 9),
      }
  
    it('returns an object with values that surpass a given divergent limit', () => {
      const values = getDivergentValues(divergence, 0.2)
      expect(values).toEqual({
        C: (22 / 9),
      })
    })
  })
  