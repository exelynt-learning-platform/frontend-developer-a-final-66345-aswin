import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { emp_formData } from "../../types/employee"
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { createEmployees, fetchEmployeeById, updateEmployees } from "../../features/employees/employeeService"
import { clearError, clearSelectedEmployee } from "../../features/employees/employeeSlice"
import { fetchCountry } from "../../features/countries/countryService"
import { Loader } from "../common/Loader"
import { ErrorMessage } from "../common/ErrorMessage"
import EmployeeFormView from "./EmployeeFormView"

const EmployeeForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<emp_formData>()
    const { id } = useParams()
    const navigate = useNavigate()
    const appDispatch = useAppDispatch()
    const { selectedEmployee, loading, error } = useAppSelector((state) => state.emp)
    const { country } = useAppSelector((state) => state.country)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset slice error and unmount/mode-switch cleanup
    useEffect(() => {
        appDispatch(clearError())
        if (!id) {
            appDispatch(clearSelectedEmployee())
        }
    }, [id, appDispatch])

    useEffect(() => {
        if (id) {
            appDispatch(fetchEmployeeById(id))
        }
    }, [id, appDispatch])

    useEffect(() => {
        appDispatch(fetchCountry())
    }, [appDispatch])

    useEffect(() => {
        if (id && selectedEmployee) {
            reset({
                name: selectedEmployee.name,
                mail: selectedEmployee.mail,
                ph_no: selectedEmployee.ph_no,
                country: selectedEmployee.country,
                state: selectedEmployee.state,
                city: selectedEmployee.city
            })
        }
    }, [id, selectedEmployee, reset])

    const onPlace = async (data: emp_formData) => {
        setSubmitError(null)
        setIsSubmitting(true)
        try {
            if (id) {
                await appDispatch(updateEmployees({ id, data })).unwrap()
            } else {
                await appDispatch(createEmployees(data)).unwrap()
            }
            navigate("/employees")
        } catch (err: unknown) {
            const message = typeof err === 'string'
                ? err
                : (err as { message?: string })?.message || "Failed to save employee. Please try again."
            setSubmitError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRetry = () => {
        if (id) {
            appDispatch(fetchEmployeeById(id))
        } else {
            appDispatch(fetchCountry())
        }
    }

    if (loading)
        return <Loader />
    if (error)
        return <ErrorMessage message={error} onRetry={handleRetry} />

    const isEdit = Boolean(id)

    return (
        <EmployeeFormView
            isEdit={isEdit}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={onPlace}
            onCancel={() => navigate("/employees")}
            countries={country}
            isSubmitting={isSubmitting}
            submitError={submitError}
        />
    )
}

export default EmployeeForm