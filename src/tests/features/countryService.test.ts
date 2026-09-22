import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fetchCountry } from '../../features/countries/countryService'
import * as countryApi from '../../api/countryApi'

vi.mock('../../api/countryApi')

const mockCountries = [
  { id: '1', name: 'India' },
  { id: '2', name: 'USA' }
]

describe('countryService thunk', () => {
  const dispatch = vi.fn()
  const getState = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchCountry returns countries list on success', async () => {
    vi.mocked(countryApi.getCountries).mockResolvedValueOnce(mockCountries)

    const thunk = fetchCountry()
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('country/fetchCountry/fulfilled')
    expect(result.payload).toEqual(mockCountries)
  })

  it('fetchCountry returns rejectWithValue on failure', async () => {
    vi.mocked(countryApi.getCountries).mockRejectedValueOnce(new Error('Country fetch error'))

    const thunk = fetchCountry()
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('country/fetchCountry/rejected')
    expect(result.payload).toBe('Country fetch error')
  })
})
