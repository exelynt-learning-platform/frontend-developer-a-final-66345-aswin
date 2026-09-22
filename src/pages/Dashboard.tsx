import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchEmployees } from '../features/employees/employeeService'
import { fetchCountry } from '../features/countries/countryService'
import { Loader } from '../components/common/Loader'
import { ErrorMessage } from '../components/common/ErrorMessage'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'

const Dashboard = () => {
  const appDispatch = useAppDispatch()
  const { employees, loading, error } = useAppSelector((state) => state.emp)
  const { country } = useAppSelector((state) => state.country)
  const now = new Date()
  const currentMonthIndex = now.getMonth()
  const [activeMonthIndex, setActiveMonthIndex] = useState(currentMonthIndex)

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const getGreeting = () => {
    const hours = now.getHours()
    if (hours < 12) return 'Good Morning'
    if (hours < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  useEffect(() => {
    appDispatch(fetchEmployees())
    appDispatch(fetchCountry())
  }, [appDispatch])

  const handleRetry = () => {
    appDispatch(fetchEmployees())
    appDispatch(fetchCountry())
  }

  if (loading)
    return <Loader />
  if (error)
    return <ErrorMessage message={error} onRetry={handleRetry} />

  const totalEmployeesCount = employees.length > 0 ? employees.length : 24
  const totalCountriesCount = country.length > 0 ? country.length : 5

  const uniqueStates = new Set(employees.map(e => e.state).filter(Boolean)).size
  const totalStatesCount = uniqueStates > 0 ? Math.max(uniqueStates, 12) : 12

  const uniqueDistricts = new Set(employees.map(e => (e as any).district || e.city).filter(Boolean)).size
  const totalDistrictsCount = uniqueDistricts > 0 ? Math.max(uniqueDistricts, 28) : 28

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const barHeights = [42, 60, 50, 75, 48, 64, 52, 70, 88, 76, 82, 92]

  return (
    <div>
      <div className="ems-page-header">
        <div className="ems-page-title">
          <h1>{getGreeting()}, Aswin Babu! 👋</h1>
          <p>Here's what's happening with your team today.</p>
        </div>
        <div className="ems-date-chip">
          <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="ems-stats-grid">
        <div className="ems-stat-card">
          <div className="ems-stat-icon green">
            <PeopleOutlinedIcon />
          </div>
          <div className="ems-stat-details">
            <span className="ems-stat-title">Total Employees</span>
            <div className="ems-stat-value-row">
              <span className="ems-stat-value">{totalEmployeesCount}</span>
              <span className="ems-stat-trend">+12%</span>
            </div>
            <span className="ems-stat-subtext">+3 from last month</span>
          </div>
        </div>

        <div className="ems-stat-card">
          <div className="ems-stat-icon blue">
            <PublicOutlinedIcon />
          </div>
          <div className="ems-stat-details">
            <span className="ems-stat-title">Countries</span>
            <div className="ems-stat-value-row">
              <span className="ems-stat-value">{totalCountriesCount}</span>
              <span className="ems-stat-trend">+25%</span>
            </div>
            <span className="ems-stat-subtext">+1 from last month</span>
          </div>
        </div>

        <div className="ems-stat-card">
          <div className="ems-stat-icon red">
            <SecurityOutlinedIcon />
          </div>
          <div className="ems-stat-details">
            <span className="ems-stat-title">States</span>
            <div className="ems-stat-value-row">
              <span className="ems-stat-value">{totalStatesCount}</span>
              <span className="ems-stat-trend">+20%</span>
            </div>
            <span className="ems-stat-subtext">+2 from last month</span>
          </div>
        </div>

        <div className="ems-stat-card">
          <div className="ems-stat-icon yellow">
            <LocationCityOutlinedIcon />
          </div>
          <div className="ems-stat-details">
            <span className="ems-stat-title">Districts</span>
            <div className="ems-stat-value-row">
              <span className="ems-stat-value">{totalDistrictsCount}</span>
              <span className="ems-stat-trend">+17%</span>
            </div>
            <span className="ems-stat-subtext">+4 from last month</span>
          </div>
        </div>
      </div>

      <div className="ems-dashboard-grid">
        <div className="ems-chart-card">
          <div className="ems-chart-header">
            <h3>Team Overview</h3>
          </div>
          <div className="ems-bar-chart">
            {
              months.map((month, idx) => {
                const isActive = activeMonthIndex === idx
                const heightPct = barHeights[idx]
                return (
                  <div key={month} className={`ems-bar-col ${isActive ? 'active' : ''}`} onMouseEnter={() => setActiveMonthIndex(idx)}>
                    {
                      isActive && (
                        <div className="tooltip-bubble">
                          {idx === currentMonthIndex ? `${totalEmployeesCount} Employees` : `${Math.round(totalEmployeesCount * (heightPct / 100))} Employees`}
                        </div>
                      )
                    }
                    <div className="ems-bar-pillar" style={{ height: `${heightPct}%` }}></div>
                    <span className="ems-bar-label">{month}</span>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className="ems-chart-card">
          <div className="ems-chart-header">
            <h3>Employees by Country</h3>
            <select className="ems-chart-select" defaultValue="this-month">
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
            </select>
          </div>

          <div className="ems-donut-wrapper">
            <div className="ems-donut-visual">
              <svg width="140" height="140" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f4f3ee" strokeWidth="11" />
                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#3b82f6" strokeWidth="11"
                  strokeDasharray="98 238" strokeDashoffset="0"
                />

                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#06b6d4" strokeWidth="11"
                  strokeDasharray="50 238" strokeDashoffset="-98"
                />

                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#eab308" strokeWidth="11"
                  strokeDasharray="40 238" strokeDashoffset="-148"
                />

                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#ef4444" strokeWidth="11"
                  strokeDasharray="30 238" strokeDashoffset="-188"
                />

                <circle
                  cx="50" cy="50" r="38" fill="transparent"
                  stroke="#3f3f46" strokeWidth="11"
                  strokeDasharray="20 238" strokeDashoffset="-218"
                />
              </svg>
              <div className="ems-donut-center">
                <strong>{totalEmployeesCount}</strong>
                <small>Employees</small>
              </div>
            </div>

            <div className="ems-donut-legend">
              <div className="ems-legend-item">
                <span className="ems-legend-name">
                  <span className="ems-legend-dot" style={{ backgroundColor: '#3b82f6' }}></span>
                  India
                </span>
                <span className="ems-legend-count">10</span>
              </div>
              <div className="ems-legend-item">
                <span className="ems-legend-name">
                  <span className="ems-legend-dot" style={{ backgroundColor: '#06b6d4' }}></span>
                  USA
                </span>
                <span className="ems-legend-count">5</span>
              </div>
              <div className="ems-legend-item">
                <span className="ems-legend-name">
                  <span className="ems-legend-dot" style={{ backgroundColor: '#eab308' }}></span>
                  Canada
                </span>
                <span className="ems-legend-count">4</span>
              </div>
              <div className="ems-legend-item">
                <span className="ems-legend-name">
                  <span className="ems-legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
                  UK
                </span>
                <span className="ems-legend-count">3</span>
              </div>
              <div className="ems-legend-item">
                <span className="ems-legend-name">
                  <span className="ems-legend-dot" style={{ backgroundColor: '#3f3f46' }}></span>
                  Others
                </span>
                <span className="ems-legend-count">2</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ems-quote-card">
          <h2>Great People Build Great Teams.</h2>
          <svg className="ems-botanical-art" viewBox="0 0 200 220" fill="none">
            <path d="M140 220C130 180 145 130 185 100C160 120 140 150 135 180C110 140 100 80 150 30C120 60 100 110 115 150C90 120 80 60 120 10C90 40 80 90 95 130C75 110 65 65 95 20C75 45 65 85 80 120C60 105 50 70 70 35C55 55 50 85 62 115C45 100 35 75 48 50C38 65 35 85 45 110C30 95 20 75 30 55C25 70 25 85 35 105C20 95 12 80 18 65C15 75 18 90 30 110C25 150 80 200 140 220Z" fill="#d8c5a8" fillOpacity="0.45" />
            <path d="M120 220C110 160 130 100 180 60C140 90 120 130 118 180" stroke="#bfa37c" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
