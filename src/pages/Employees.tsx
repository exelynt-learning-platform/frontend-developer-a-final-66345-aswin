import { useEffect } from 'react'
import { useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom'
import { fetchEmployees } from '../features/employees/employeeService'
import { fetchCountry } from '../features/countries/countryService'
import EmployeeTable from '../components/employee/EmployeeTable'
import AddIcon from '@mui/icons-material/Add'

const Employees = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    appDispatch(fetchEmployees())
    appDispatch(fetchCountry())
  }, [appDispatch])

  return (
    <div>
      <div className="ems-page-header">
        <div className="ems-page-title">
          <h1>Employees</h1>
          <p>Manage your team members</p>
        </div>
        <button className="ems-btn ems-btn-primary" onClick={() => navigate("/employees/add")}>
          <AddIcon fontSize="small" />
          <span>Add Employee</span>
        </button>
      </div>
      <EmployeeTable />
    </div>
  )
}

export default Employees
