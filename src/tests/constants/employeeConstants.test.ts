import { describe, expect, it } from 'vitest'
import {
  getAvatarUrl,
  getCountryFlag,
  DEFAULT_PAGE_SIZE,
  DEFAULT_AVATAR
} from '../../constants/employeeConstants'

describe('employeeConstants and helpers', () => {
  it('exports default page size and default avatar', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(5)
    expect(DEFAULT_AVATAR).toContain('images.unsplash.com')
  })

  it('returns correct country flags', () => {
    expect(getCountryFlag('India')).toBe('🇮🇳')
    expect(getCountryFlag('USA')).toBe('🇺🇸')
    expect(getCountryFlag('United Kingdom')).toBe('🇬🇧')
    expect(getCountryFlag('Germany')).toBe('🇩🇪')
    expect(getCountryFlag('Japan')).toBe('🇯🇵')
    expect(getCountryFlag('UnknownLand')).toBe('🌐')
    expect(getCountryFlag('')).toBe('🌐')
  })

  it('returns avatar urls by id and index', () => {
    const avatarFor1 = getAvatarUrl('1', 0)
    expect(avatarFor1).toContain('images.unsplash.com')

    const avatarForNonNum = getAvatarUrl('abc', 2)
    expect(avatarForNonNum).toContain('images.unsplash.com')
  })
})
