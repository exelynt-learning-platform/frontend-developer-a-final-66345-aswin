import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCountries } from "../../api/countryApi"
import type { Country } from "../../types/country"
import { ERROR_MESSAGE } from "../../constants/CentralizedErrorMessage"
import { extractErrorMessage } from "../../utils/errorUtils"

export const fetchCountry = createAsyncThunk<Country[], void, { rejectValue: string }>('country/fetchCountry', async (_, { rejectWithValue }) => {
    try {
        const countries = await getCountries()
        return countries
    }
    catch (error) {
        return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGE.Country.FETCH_FAILED))
    }
})