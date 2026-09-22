import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from '../features/employees/employeeSlice'
import countryReducer from '../features/countries/countrySlice'

const store = configureStore({
    reducer: {
        emp: employeeReducer,
        country: countryReducer
    }
}) 

export type root = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store