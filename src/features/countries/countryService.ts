import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCountries } from "../../api/countryApi"
import type { Country } from "../../types/country"
import { ERROR_MESSAGE } from "../../constants/CentralizedErrorMessage"


export const fetchCountry = createAsyncThunk<Country[], void, { rejectValue: string }>('country/fetchCountry', async (_, { rejectWithValue }) => {
    try {
        const getcountry = await getCountries()
        return getcountry
    }
    catch {
        return rejectWithValue(ERROR_MESSAGE.Country.FETCH_FAILED)
    }
})