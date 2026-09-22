import { describe, expect, it } from 'vitest'
import { getCountries } from '../../api/countryApi'

describe('Country API', () => {
  it('should fetch all countries', async () => {
    const countries = await getCountries()
    expect(countries).toHaveLength(3)
    expect(countries[0]).toMatchObject({
      id: '1',
      name: 'India'
    })
    expect(countries[1]).toMatchObject({
      id: '2',
      name: 'USA'
    })
    expect(countries[2]).toMatchObject({
      id: '3',
      name: 'UK'
    })
  })
})
