import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useEffect } from "react"
import { fetchEmployeeById } from "../features/employees/employeeService"
import { Loader } from "../components/common/Loader"
import { ErrorMessage } from "../components/common/ErrorMessage"
import { EmptyState } from "../components/common/EmptyState"
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

const SingleEmployeeInfo = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { selectedEmployee, loading, error } = useAppSelector((state) => state.emp)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) 
      appDispatch(fetchEmployeeById(id))
  }, [id, appDispatch])

  const handleRetry = () => {
    if (id) 
      appDispatch(fetchEmployeeById(id))
  }

  if (loading) 
    return <Loader />
  if (error) 
    return <ErrorMessage message={error} onRetry={handleRetry} />
  if (!selectedEmployee) 
    return <EmptyState message="Employee not found" onRetry={handleRetry} />

  const avatarUrl = (selectedEmployee as any).avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80'

  const districtOrCity = (selectedEmployee as any).district || selectedEmployee.city || 'N/A'
  const emailDisplay = selectedEmployee.mail || (selectedEmployee as any).email || (selectedEmployee as any).emailId || 'N/A'
  const mobileDisplay = selectedEmployee.ph_no || (selectedEmployee as any).mobile || 'N/A'

  return (
    <div>
      <div className="ems-page-header">
        <div className="ems-page-title">
          <h1>Employee Details</h1>
          <p>View complete information about the employee.</p>
        </div>
        <button type="button" className="ems-btn ems-btn-outline" onClick={() => navigate("/employees")}>
          <ArrowBackOutlinedIcon fontSize="small" />
          <span>Back</span>
        </button>
      </div>

      <div className="ems-details-layout">
        <div className="ems-profile-card">
          <div className="ems-profile-avatar-lg">
            <img src={avatarUrl} alt={selectedEmployee.name} onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none' }} />
            <span>{selectedEmployee.name ? selectedEmployee.name.charAt(0).toUpperCase() : 'E'}</span>
          </div>

          <h3>{selectedEmployee.name}</h3>
          <span className="ems-profile-role">Software Engineer</span>
          <span className="ems-status-badge">Active</span>
          <span className="ems-id-badge">ID: {selectedEmployee.id}</span>
        </div>

        <div className="ems-info-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f2f0ea' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>Employee info</h4>
          </div>

          <div className="ems-info-grid">
            <div className="ems-info-item">
              <div className="ems-info-icon">
                <EmailOutlinedIcon fontSize="small" />
              </div>
              <div className="ems-info-content">
                <small>Email</small>
                <strong>{emailDisplay}</strong>
              </div>
            </div>

            <div className="ems-info-item">
              <div className="ems-info-icon">
                <PhoneAndroidOutlinedIcon fontSize="small" />
              </div>
              <div className="ems-info-content">
                <small>Mobile</small>
                <strong>{mobileDisplay}</strong>
              </div>
            </div>

            <div className="ems-info-item">
              <div className="ems-info-icon">
                <PublicOutlinedIcon fontSize="small" />
              </div>
              <div className="ems-info-content">
                <small>Country</small>
                <strong>{selectedEmployee.country}</strong>
              </div>
            </div>

            <div className="ems-info-item">
              <div className="ems-info-icon">
                <MapOutlinedIcon fontSize="small" />
              </div>
              <div className="ems-info-content">
                <small>State</small>
                <strong>{selectedEmployee.state}</strong>
              </div>
            </div>

            <div className="ems-info-item">
              <div className="ems-info-icon">
                <LocationOnOutlinedIcon fontSize="small" />
              </div>
              <div className="ems-info-content">
                <small>District</small>
                <strong>{districtOrCity}</strong>
              </div>
            </div>

            <div className="ems-info-item">
              <div className="ems-info-icon">
                <CalendarMonthOutlinedIcon fontSize="small" />
              </div>
              <div className="ems-info-content">
                <small>Joined Date</small>
                <strong>Jan 15, 2024</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #f2f0ea' }}>
            <button type="button" className="ems-btn ems-btn-primary" onClick={() => navigate(`/employees/edit/${selectedEmployee.id}`)}>
              <EditOutlinedIcon fontSize="small" />
              <span>Edit Employee</span>
            </button>
            <button type="button" className="ems-btn ems-btn-outline" onClick={() => navigate("/employees")}>Back</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleEmployeeInfo
