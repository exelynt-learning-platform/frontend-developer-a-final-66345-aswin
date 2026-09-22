import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import EmployeeFormView from '../../components/employee/EmployeeFormView'
import type { emp_formData } from '../../types/employee'
import type { Country } from '../../types/country'

const mockCountries: Country[] = [
  { id: '1', country: 'India' },
  { id: '2', country: 'USA' }
]

const FormWrapper = ({
  isEdit = false,
  submitError = null,
  isSubmitting = false,
  onSubmit = vi.fn(),
  onCancel = vi.fn(),
}: {
  isEdit?: boolean
  submitError?: string | null
  isSubmitting?: boolean
  onSubmit?: (data: emp_formData) => void
  onCancel?: () => void
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<emp_formData>()

  return (
    <EmployeeFormView
      isEdit={isEdit}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      onSubmit={onSubmit}
      onCancel={onCancel}
      countries={mockCountries}
      isSubmitting={isSubmitting}
      submitError={submitError}
    />
  )
}

describe('EmployeeFormView presentational component', () => {
  it('renders Add New Employee title in add mode', () => {
    render(<FormWrapper isEdit={false} />)
    expect(screen.getByText('Add New Employee')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add employee/i })).toBeInTheDocument()
  })

  it('renders Edit Employee title in edit mode', () => {
    render(<FormWrapper isEdit={true} />)
    expect(screen.getByText('Edit Employee')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update employee/i })).toBeInTheDocument()
  })

  it('renders error banner when submitError is provided', () => {
    render(<FormWrapper submitError="Failed to submit employee data." />)
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to submit employee data.')
  })

  it('calls onCancel when Cancel or Back button is clicked', () => {
    const handleCancel = vi.fn()
    render(<FormWrapper onCancel={handleCancel} />)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(handleCancel).toHaveBeenCalledTimes(2)
  })

  it('renders country options inside select', () => {
    render(<FormWrapper />)
    expect(screen.getByRole('option', { name: 'India' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'USA' })).toBeInTheDocument()
  })

  it('disables submit button when isSubmitting is true', () => {
    render(<FormWrapper isSubmitting={true} />)
    const submitBtn = screen.getByRole('button', { name: /saving/i })
    expect(submitBtn).toBeDisabled()
  })

  it('submits form when all fields are valid', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<FormWrapper onSubmit={handleSubmit} />)

    await user.type(screen.getByPlaceholderText('Enter the employee name'), 'Johnathan')
    await user.type(screen.getByPlaceholderText('Enter the employee mail'), 'johnathan@example.com')
    await user.type(screen.getByPlaceholderText('Enter the employee mobile'), '9876543210')
    await user.selectOptions(screen.getByRole('combobox'), 'India')
    await user.type(screen.getByPlaceholderText('Enter the employee state'), 'Karnataka')
    await user.type(screen.getByPlaceholderText('Enter the employee city'), 'Bangalore')

    await user.click(screen.getByRole('button', { name: /add employee/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Johnathan',
          mail: 'johnathan@example.com',
          ph_no: '9876543210',
          country: 'India',
          state: 'Karnataka',
          city: 'Bangalore',
        }),
        expect.anything()
      )
    })
  })
})
