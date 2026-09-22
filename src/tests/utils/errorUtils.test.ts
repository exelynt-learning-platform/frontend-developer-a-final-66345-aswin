import { describe, expect, it } from 'vitest'
import { extractErrorMessage } from '../../utils/errorUtils'

describe('errorUtils', () => {
  it('extracts message from Error instance', () => {
    const error = new Error('Database connection failed')
    expect(extractErrorMessage(error, 'Fallback message')).toBe('Database connection failed')
  })

  it('uses fallback message when Error instance message is empty', () => {
    const error = new Error('')
    expect(extractErrorMessage(error, 'Fallback message')).toBe('Fallback message')
  })

  it('extracts string error directly', () => {
    expect(extractErrorMessage('Direct error text', 'Fallback message')).toBe('Direct error text')
  })

  it('uses fallback message when string error is empty', () => {
    expect(extractErrorMessage('', 'Fallback message')).toBe('Fallback message')
  })

  it('extracts message from Axios-like response object', () => {
    const axiosError = {
      response: {
        data: {
          message: 'Server error: User already exists'
        }
      }
    }
    expect(extractErrorMessage(axiosError, 'Fallback message')).toBe('Server error: User already exists')
  })

  it('extracts message from top-level message property if response data is missing', () => {
    const objError = { message: 'Network request timed out' }
    expect(extractErrorMessage(objError, 'Fallback message')).toBe('Network request timed out')
  })

  it('returns fallback message for unknown non-error types like null, undefined, numbers', () => {
    expect(extractErrorMessage(null, 'Fallback message')).toBe('Fallback message')
    expect(extractErrorMessage(undefined, 'Fallback message')).toBe('Fallback message')
    expect(extractErrorMessage(404, 'Fallback message')).toBe('Fallback message')
    expect(extractErrorMessage({}, 'Fallback message')).toBe('Fallback message')
  })
})
