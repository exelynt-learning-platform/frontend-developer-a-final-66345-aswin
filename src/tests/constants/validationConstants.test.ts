import { describe, expect, it } from 'vitest'
import { VALIDATION_RULES } from '../../constants/validationConstants'

describe('validationConstants', () => {
  it('defines valid validation rules for employee form fields', () => {
    expect(VALIDATION_RULES.NAME.required).toBe('Name is required')
    expect(VALIDATION_RULES.NAME.minLength.value).toBe(3)
    expect(VALIDATION_RULES.NAME.maxLength.value).toBe(35)

    expect(VALIDATION_RULES.EMAIL.required).toBe('Email is required')
    expect(VALIDATION_RULES.EMAIL.pattern.value).toBeInstanceOf(RegExp)

    expect(VALIDATION_RULES.PHONE.required).toBe('Mobile number is required')
    expect(VALIDATION_RULES.PHONE.minLength.value).toBe(10)
    expect(VALIDATION_RULES.PHONE.maxLength.value).toBe(10)

    expect(VALIDATION_RULES.COUNTRY.required).toBe('Country is required')
    expect(VALIDATION_RULES.STATE.required).toBe('State is required')
    expect(VALIDATION_RULES.CITY.required).toBe('City is required')
  })

  it('correctly matches valid and invalid email patterns', () => {
    const emailRegex = VALIDATION_RULES.EMAIL.pattern.value
    expect(emailRegex.test('user@example.com')).toBe(true)
    expect(emailRegex.test('invalid-email')).toBe(false)
    expect(emailRegex.test('@no-user.com')).toBe(false)
    expect(emailRegex.test('user@domain')).toBe(false)
  })
})
