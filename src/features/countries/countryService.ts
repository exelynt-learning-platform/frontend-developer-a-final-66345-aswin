import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCountries } from "../../api/countryApi"
import type { Country } from "../../types/country"
import { ERROR_MESSAGE } from "../../constants/CentralizedErrorMessage"

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (typeof error === 'object' && error !== null) {
        const err = error as { response?: { data?: { message?: string } }; message?: string }
        return err.response?.data?.message || err.message || fallback
    }
    return fallback
}

export const fetchCountry = createAsyncThunk<Country[], void, { rejectValue: string }>('country/fetchCountry', async (_, { rejectWithValue }) => {
    try {
        const getcountry = await getCountries()
        return getcountry
    }
    catch (error) {
        return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGE.Country.FETCH_FAILED))
    }
})