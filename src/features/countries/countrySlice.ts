import { createSlice } from "@reduxjs/toolkit"
import { fetchCountry } from "./countryService"
import type { Country } from "../../types/country"
import { ERROR_MESSAGE } from "../../constants/CentralizedErrorMessage"

interface countryState {
    country: Country[]
    loading: boolean
    error: string | null
}

const initialState: countryState = {
    country: [],
    loading: false,
    error: null
}

const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (build) => {
        build.addCase(fetchCountry.pending, (state) => {
            state.loading = true
            state.error = null
        })

        build.addCase(fetchCountry.fulfilled, (state, action) => {
            state.loading = false
            state.country = action.payload
        })

        build.addCase(fetchCountry.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload ?? ERROR_MESSAGE.Country.FETCH_FAILED
        })
    }
})

export default countrySlice.reducer
