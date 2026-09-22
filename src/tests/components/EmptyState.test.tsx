import { describe, it, vi, expect } from "vitest";
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyState } from "../../components/common/EmptyState";

describe('EmptyState', () => {
    it('should display the empty state message', () => {
        const onRetry = vi.fn()
        render(<EmptyState message="Employee not found" onRetry={onRetry} />)
        expect(screen.getByText('Employee not found')).toBeInTheDocument()
    })

    it('should call onRetry when Retry button is clicked', async () => {
        const onRetry = vi.fn()
        const user = userEvent.setup()
        render(<EmptyState message="Employee not found" onRetry={onRetry}/>)
        const retryBtn = screen.getByRole('button', {
            name: 'Retry'
        })
        await user.click(retryBtn)

        expect(onRetry).toHaveBeenCalledTimes(1)
    })
})