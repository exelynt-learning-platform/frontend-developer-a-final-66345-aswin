/**
 * Centralized form validation rules and error messages for employee records.
 */
export const VALIDATION_RULES = {
    NAME: {
        required: "Name is required",
        minLength: {
            value: 3,
            message: "Name must be at least 3 characters"
        },
        maxLength: {
            value: 35,
            message: "Name cannot exceed 35 characters"
        }
    },
    EMAIL: {
        required: "Email is required",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address"
        }
    },
    PHONE: {
        required: "Mobile number is required",
        minLength: {
            value: 10,
            message: "Mobile must be 10 digits"
        },
        maxLength: {
            value: 10,
            message: "Mobile must be 10 digits"
        }
    },
    COUNTRY: {
        required: "Country is required"
    },
    STATE: {
        required: "State is required"
    },
    CITY: {
        required: "City is required"
    }
} as const
