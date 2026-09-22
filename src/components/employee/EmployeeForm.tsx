import { useNavigate, useParams } from "react-router-dom"
import type { emp_formData } from "../../types/employee"
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useEffect } from "react"
import { createEmployees, fetchEmployeeById, updateEmployees } from "../../features/employees/employeeService"
import { fetchCountry } from "../../features/countries/countryService"
import { Loader } from "../common/Loader"
import { ErrorMessage } from "../common/ErrorMessage"
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'

const EmployeeForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<emp_formData>()
    const { id } = useParams()
    const navigate = useNavigate()
    const appDispatch = useAppDispatch()
    const { selectedEmployee, loading, error } = useAppSelector((state) => state.emp)
    const { country } = useAppSelector((state) => state.country)

    useEffect(() => {
        if (id)
            appDispatch(fetchEmployeeById(id))
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
        try {
            if (id) {
                await appDispatch(updateEmployees({ id, data })).unwrap()
            } else {
                await appDispatch(createEmployees(data)).unwrap()
            }
            navigate("/employees")
        } catch {

        }
    }

    const handleRetry = () => {
        if (id)
            appDispatch(fetchEmployeeById(id))
        else
            appDispatch(fetchCountry())
    }

    if (loading)
        return <Loader />
    if (error)
        return <ErrorMessage message={error} onRetry={handleRetry} />

    const isEdit = Boolean(id)

    return (
        <div>
            <div className="ems-page-header">
                <div className="ems-page-title">
                    <h1>{isEdit ? "Edit Employee" : "Add New Employee"}</h1>
                    <p>
                        {isEdit ? "Update the employee details." : "Fill in the details to add a new employee to your team."}
                    </p>
                </div>
                <button type="button" className="ems-btn ems-btn-outline" onClick={() => navigate("/employees")}>
                    <ArrowBackOutlinedIcon fontSize="small" />
                    <span>Back</span>
                </button>
            </div>

            <div className="ems-form-layout">
                <div className="ems-form-card">
                    <form onSubmit={handleSubmit(onPlace)} noValidate>
                        <div className="ems-form-grid">
                            <div className="ems-form-group">
                                <label className="ems-form-label">Name <span className="required">*</span></label>
                                <input type="text" className={`ems-input ${errors.name ? 'is-invalid' : ''}`} placeholder="Enter the employee name"
                                    {
                                    ...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Name must be at least 3 characters"
                                        },
                                        maxLength: {
                                            value: 35,
                                            message: "Name cannot exceed 35 characters"
                                        }
                                    })
                                    } />
                                {
                                    errors.name && (
                                        <span className="ems-form-error">{errors.name.message}</span>
                                    )
                                }
                            </div>

                            <div className="ems-form-group">
                                <label className="ems-form-label">Email <span className="required">*</span></label>
                                <input type="text" className={`ems-input ${errors.mail ? 'is-invalid' : ''}`} placeholder="Enter the employee mail"
                                    {
                                    ...register("mail", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email address"
                                        }
                                    })
                                    } />
                                {
                                    errors.mail && (
                                        <span className="ems-form-error">{errors.mail.message}</span>
                                    )
                                }
                            </div>

                            <div className="ems-form-group">
                                <label className="ems-form-label">Mobile <span className="required">*</span></label>
                                <input type="text" className={`ems-input ${errors.ph_no ? 'is-invalid' : ''}`} placeholder="Enter the employee mobile"
                                    {
                                    ...register("ph_no", {
                                        required: "Mobile number is required",
                                        minLength: {
                                            value: 10,
                                            message: "Mobile must be 10 digits"
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: "Mobile must be 10 digits"
                                        }
                                    })
                                    } />
                                {
                                    errors.ph_no && (
                                        <span className="ems-form-error">{errors.ph_no.message}</span>
                                    )
                                }
                            </div>

                            <div className="ems-form-group">
                                <label className="ems-form-label">Country <span className="required">*</span></label>
                                <select className={`ems-select ${errors.country ? 'is-invalid' : ''}`}
                                    {
                                    ...register("country", {
                                        required: "Country is required"
                                    })
                                    }>
                                    <option value="">Select country</option>
                                    {
                                        country && country.map((item: any) => {
                                            const cName = item.country || item.name
                                            return (
                                                <option key={item.id || cName} value={cName}>{cName}</option>
                                            )
                                        })
                                    }
                                </select>
                                {
                                    errors.country && (
                                        <span className="ems-form-error">{errors.country.message}</span>
                                    )
                                }
                            </div>

                            <div className="ems-form-group">
                                <label className="ems-form-label">State <span className="required">*</span></label>
                                <input type="text" className={`ems-input ${errors.state ? 'is-invalid' : ''}`} placeholder="Enter the employee state"
                                    {
                                    ...register("state", {
                                        required: "State is required"
                                    })} />
                                {
                                    errors.state && (
                                        <span className="ems-form-error">{errors.state.message}</span>
                                    )
                                }
                            </div>

                            <div className="ems-form-group">
                                <label className="ems-form-label">District <span className="required">*</span></label>
                                <input type="text" className={`ems-input ${errors.city ? 'is-invalid' : ''}`} placeholder="Enter the employee city"
                                    {
                                    ...register("city", {
                                        required: "City is required"
                                    })} />
                                {
                                    errors.city && (
                                        <span className="ems-form-error">{errors.city.message}</span>
                                    )
                                }
                            </div>
                        </div>

                        <div className="ems-form-actions">
                            <button type="button" className="ems-btn ems-btn-outline" onClick={() => navigate("/employees")}>Cancel</button>
                            <button type="submit" className="ems-btn ems-btn-primary" disabled={loading} aria-label={isEdit ? "Update Employee" : "Add Employee"}>{isEdit ? "Update Employee" : "Save Employee"}</button>
                        </div>
                    </form>
                </div>

                <div className="ems-side-promo">
                    <div className="ems-promo-avatar">
                        {
                            isEdit ? (
                                <EditNoteOutlinedIcon sx={{ fontSize: 36 }} />
                            ) : (
                                <PersonAddOutlinedIcon sx={{ fontSize: 36 }} />
                            )
                        }
                    </div>
                    <h3>{isEdit ? "Keep Information Up to Date" : "Add New Talent"}</h3>
                    <p>{isEdit ? "Accurate data builds better teams." : "Every great team starts with people."}</p>

                    <svg className="ems-promo-art" viewBox="0 0 200 200" fill="none">
                        <path d="M120 200C110 160 125 110 165 80C140 100 120 130 115 160C90 120 80 60 130 10C100 40 80 90 95 130C75 110 65 65 95 20C75 45 65 85 80 120C60 105 50 70 70 35C55 55 50 85 62 115C45 100 35 75 48 50C38 65 35 85 45 110C30 95 20 75 30 55C25 70 25 85 35 105C20 95 12 80 18 65C15 75 18 90 30 110C25 150 80 180 120 200Z" fill="#e8dacb" fillOpacity="0.6" />
                        <path d="M100 200C90 140 110 80 160 40C120 70 100 110 98 160" stroke="#cfb59b" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default EmployeeForm