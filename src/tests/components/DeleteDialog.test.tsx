import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DeleteDialog from '../../components/employee/DeleteDialog'

describe('DeleteDialog component', () => {
  it('renders with accessibility attributes and content', () => {
    const handleClose = vi.fn()
    const handleConfirm = vi.fn()

    render(
      <DeleteDialog
        empId="42"
        empName="John Doe"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Delete Employee')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('calls onClose when Cancel button is clicked', () => {
    const handleClose = vi.fn()
    const handleConfirm = vi.fn()

    render(
      <DeleteDialog
        empId="42"
        empName="John Doe"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm with empId when Delete button is clicked', () => {
    const handleClose = vi.fn()
    const handleConfirm = vi.fn()

    render(
      <DeleteDialog
        empId="42"
        empName="John Doe"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(handleConfirm).toHaveBeenCalledWith('42')
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    const handleConfirm = vi.fn()

    render(
      <DeleteDialog
        empId="42"
        empName="John Doe"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn()
    const handleConfirm = vi.fn()

    const { container } = render(
      <DeleteDialog
        empId="42"
        empName="John Doe"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    )

    const backdrop = container.firstChild as HTMLElement
    fireEvent.click(backdrop)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
