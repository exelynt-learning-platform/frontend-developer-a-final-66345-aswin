import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorMessage } from '../../components/common/ErrorMessage'

describe('ErrorMessage', () => {

  it('should display the error message', () => {
    const onRetry = vi.fn()

    render(
      <ErrorMessage
        message="Failed to fetch employees."
        onRetry={onRetry}
      />
    )

    expect(
      screen.getByText('Failed to fetch employees.')
    ).toBeInTheDocument()
  })

  it('should call onRetry when Retry button is clicked', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()

    render(
      <ErrorMessage
        message="Failed to fetch employees."
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByRole('button', {
      name: 'Retry',
    })

    await user.click(retryButton)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

})