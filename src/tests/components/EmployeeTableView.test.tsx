import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmployeeTableView from '../../components/employee/EmployeeTableView'
import type { Employee } from '../../types/employee'
import type { Country } from '../../types/country'

const mockEmployees: Employee[] = [
  {
    id: '101',
    name: 'Sarah Connor',
    mail: 'sarah@example.com',
    ph_no: '9876543210',
    country: 'USA',
    state: 'California',
    city: 'Los Angeles'
  },
  {
    id: '102',
    name: 'John Connor',
    mail: 'john@example.com',
    ph_no: '9876543211',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore'
  }
]

const mockCountries: Country[] = [
  { id: '1', country: 'USA' },
  { id: '2', country: 'India' }
]

describe('EmployeeTableView (presentational)', () => {
  const defaultProps = {
    displayedEmployees: mockEmployees,
    selectedIds: [],
    allSelected: false,
    searchTerm: '',
    selectedCountry: 'All',
    countries: mockCountries,
    totalItems: 2,
    startIndex: 0,
    itemsPerPage: 5,
    currentPage: 1,
    totalPages: 1,
    deleteError: null,
    onSearchChange: vi.fn(),
    onCountryChange: vi.fn(),
    onToggleSelectAll: vi.fn(),
    onToggleSelectRow: vi.fn(),
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onPageChange: vi.fn(),
    onDismissDeleteError: vi.fn()
  }

  it('renders employee rows and info', () => {
    render(<EmployeeTableView {...defaultProps} />)
    expect(screen.getByText('Sarah Connor')).toBeInTheDocument()
    expect(screen.getByText('John Connor')).toBeInTheDocument()
    expect(screen.getByText('sarah@example.com')).toBeInTheDocument()
    expect(screen.getByText('Showing 1 to 2 of 2 employees')).toBeInTheDocument()
  })

  it('renders deleteError banner and handles dismiss', () => {
    const handleDismiss = vi.fn()
    render(<EmployeeTableView {...defaultProps} deleteError="Failed to delete employee" onDismissDeleteError={handleDismiss} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to delete employee')
    const dismissBtn = screen.getByRole('button', { name: 'Dismiss error' })
    fireEvent.click(dismissBtn)
    expect(handleDismiss).toHaveBeenCalled()
  })

  it('handles search input change and country select change', () => {
    const handleSearch = vi.fn()
    const handleCountry = vi.fn()
    render(<EmployeeTableView {...defaultProps} onSearchChange={handleSearch} onCountryChange={handleCountry} />)

    const searchInput = screen.getByPlaceholderText(/Search by ID, name, email or mobile/i)
    fireEvent.change(searchInput, { target: { value: 'Sarah' } })
    expect(handleSearch).toHaveBeenCalledWith('Sarah')

    const countrySelect = screen.getByLabelText('Filter by country')
    fireEvent.change(countrySelect, { target: { value: 'USA' } })
    expect(handleCountry).toHaveBeenCalledWith('USA')
  })

  it('handles row actions: view, edit, delete', () => {
    const handleView = vi.fn()
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()

    render(<EmployeeTableView {...defaultProps} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />)

    const viewBtn = screen.getAllByRole('button', { name: 'View' })[0]
    fireEvent.click(viewBtn)
    expect(handleView).toHaveBeenCalledWith('101')

    const editBtn = screen.getAllByRole('button', { name: 'Edit' })[0]
    fireEvent.click(editBtn)
    expect(handleEdit).toHaveBeenCalledWith('101')

    const deleteBtn = screen.getAllByRole('button', { name: 'Delete' })[0]
    fireEvent.click(deleteBtn)
    expect(handleDelete).toHaveBeenCalledWith('101', 'Sarah Connor')
  })

  it('renders empty table message when displayedEmployees is empty', () => {
    render(<EmployeeTableView {...defaultProps} displayedEmployees={[]} totalItems={0} />)
    expect(screen.getByText('No employees match your search criteria.')).toBeInTheDocument()
    expect(screen.getByText('Showing 0 to 0 of 0 employees')).toBeInTheDocument()
  })

  it('handles pagination button clicks', () => {
    const handlePageChange = vi.fn()
    render(
      <EmployeeTableView
        {...defaultProps}
        currentPage={2}
        totalPages={3}
        startIndex={5}
        totalItems={15}
        onPageChange={handlePageChange}
      />
    )

    const prevBtn = screen.getByLabelText('Previous page')
    fireEvent.click(prevBtn)
    expect(handlePageChange).toHaveBeenCalledWith(1)

    const nextBtn = screen.getByLabelText('Next page')
    fireEvent.click(nextBtn)
    expect(handlePageChange).toHaveBeenCalledWith(3)

    const page1Btn = screen.getByRole('button', { name: '1' })
    fireEvent.click(page1Btn)
    expect(handlePageChange).toHaveBeenCalledWith(1)
  })
})
