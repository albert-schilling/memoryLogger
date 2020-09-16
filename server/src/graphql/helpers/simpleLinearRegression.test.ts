import { simpleLinearRegression } from "./simpleLinearRegression"

const session = {
    start: '1598202983944',
    sessionLogs: [
      {
        clientTimestamp: '1598202998501',
        jsHeapSizeLimit: '4294705152',
        totalJSHeapSize: '37284233',
        usedJSHeapSize: '35794965',
      },
      {
        clientTimestamp: '1598203014424',
        jsHeapSizeLimit: '4294705152',
        totalJSHeapSize: '37284233',
        usedJSHeapSize: '36004229',
      },
      {
        clientTimestamp: '1598203014815',
        jsHeapSizeLimit: '4294705152',
        totalJSHeapSize: '37284233',
        usedJSHeapSize: '35303825',
      },
    ],
  }
  

describe('simpleLinearRegression', () => {
    it('correctly calculates the coefficients', () => {
      const {shift, gradient} = simpleLinearRegression(session.sessionLogs, 'clientTimestamp', 'usedJSHeapSize')
      expect(shift).toEqual(-1598167308224.9146)
      expect(gradient).toEqual(0.9999999999903523)
    })
  })
  