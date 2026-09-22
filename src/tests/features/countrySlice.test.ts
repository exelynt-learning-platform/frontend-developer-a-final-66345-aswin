import { describe, expect, it } from 'vitest'
import countryReducer from '../../features/countries/countrySlice'
import { fetchCountry } from '../../features/countries/countryService'

const mockCountries = [
  { id: '1', name: 'India' },
  { id: '2', name: 'USA' },
  { id: '3', name: 'UK' }
]

describe('countrySlice', () => {
  it('should handle initial state', () => {
    const state = countryReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({
      country: [],
      loading: false,
      error: null
    })
  })

  it('should handle fetchCountry.pending', () => {
    const state = countryReducer(undefined, fetchCountry.pending('request-id', undefined))
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle fetchCountry.fulfilled', () => {
    const state = countryReducer(
      undefined,
      fetchCountry.fulfilled(mockCountries, 'request-id', undefined)
    )
    expect(state.loading).toBe(false)
    expect(state.country).toEqual(mockCountries)
  })

  it('should handle fetchCountry.rejected', () => {
    const state = countryReducer(
      undefined,
      fetchCountry.rejected(new Error('Failed'), 'request-id', undefined, 'Failed to fetch country details')
    )
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Failed to fetch country details')
  })

  it('should handle clearError', () => {
    const stateWithError = countryReducer(
      undefined,
      fetchCountry.rejected(new Error('Failed'), 'request-id', undefined, 'Failed to fetch country details')
    )
    const state = countryReducer(stateWithError, { type: 'country/clearError' })
    expect(state.error).toBeNull()
  })
})
