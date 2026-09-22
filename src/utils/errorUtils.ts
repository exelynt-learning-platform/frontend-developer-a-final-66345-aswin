interface AxiosLikeError {
    response?: { data?: { message?: string } }
    message?: string
}

/**
 * Extracts a user-friendly error message from unknown error shapes.
 * Handles Axios-style errors, plain strings, and Error instances.
 */
export const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error) {
        return error.message || fallback
    }
    if (typeof error === 'string') {
        return error || fallback
    }
    if (typeof error === 'object' && error !== null) {
        const err = error as AxiosLikeError
        return err.response?.data?.message || err.message || fallback
    }
    return fallback
}
