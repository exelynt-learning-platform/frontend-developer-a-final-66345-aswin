import { useEffect, useMemo, useState } from 'react'
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

  const totalEmployeesCount = employees.length
  const totalCountriesCount = useMemo(() => {
    const activeCountries = new Set(employees.map(e => e.country?.trim()).filter(Boolean)).size
    return activeCountries || country.length
  }, [employees, country])

  const uniqueStates = useMemo(() => {
    return new Set(employees.map(e => e.state?.trim()).filter(Boolean)).size
  }, [employees])
  const totalStatesCount = uniqueStates

  const uniqueDistricts = useMemo(() => {
    return new Set(employees.map(e => e.city?.trim()).filter(Boolean)).size
  }, [employees])
  const totalDistrictsCount = uniqueDistricts

  const sliceColors = ['#3b82f6', '#06b6d4', '#eab308', '#ef4444', '#8b5cf6', '#3f3f46']
  const countryBreakdown = useMemo(() => {
    if (employees.length === 0) return []
    const counts: Record<string, number> = {}
    employees.forEach(emp => {
      const c = emp.country?.trim() || 'Other'
      counts[c] = (counts[c] || 0) + 1
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    if (sorted.length <= 5) {
      return sorted.map(([name, count]) => ({ name, count }))
    }
    const top4 = sorted.slice(0, 4).map(([name, count]) => ({ name, count }))
    const othersCount = sorted.slice(4).reduce((acc, curr) => acc + curr[1], 0)
    return [...top4, { name: 'Others', count: othersCount }]
  }, [employees])

  const circumference = 2 * Math.PI * 38
  let cumulativeOffset = 0
  const donutSlices = countryBreakdown.map((item, idx) => {
    const fraction = totalEmployeesCount > 0 ? item.count / totalEmployeesCount : 0
    const dashLength = fraction * circumference
    const slice = {
      name: item.name,
      count: item.count,
      color: sliceColors[idx % sliceColors.length],
      strokeDasharray: `${dashLength.toFixed(1)} ${(circumference - dashLength).toFixed(1)}`,
      strokeDashoffset: -cumulativeOffset
    }
    cumulativeOffset += dashLength
    return slice
  })

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const barHeights = [25, 40, 35, 50, 45, 60, 55, 70, 85, 75, 80, 90]

  if (loading)
    return <Loader />
  if (error)
    return <ErrorMessage message={error} onRetry={handleRetry} />

  return (
    <div>
      <div className="ems-page-header">
        <div className="ems-page-title">
          <h1>{getGreeting()}, Admin! 👋</h1>
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
              <span className="ems-stat-trend">Active</span>
            </div>
            <span className="ems-stat-subtext">Registered in directory</span>
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
              <span className="ems-stat-trend">Global</span>
            </div>
            <span className="ems-stat-subtext">Active regions</span>
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
              <span className="ems-stat-trend">Regional</span>
            </div>
            <span className="ems-stat-subtext">Across territories</span>
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
              <span className="ems-stat-trend">Local</span>
            </div>
            <span className="ems-stat-subtext">Cities &amp; districts</span>
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
                          {idx === currentMonthIndex ? `${totalEmployeesCount} Employees (Current)` : `${totalEmployeesCount > 0 ? Math.max(1, Math.round(totalEmployeesCount * (heightPct / 100))) : 0} Employees`}
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
          </div>

          <div className="ems-donut-wrapper">
            <div className="ems-donut-visual">
              <svg width="140" height="140" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f4f3ee" strokeWidth="11" />
                <g transform="rotate(-90 50 50)">
                  {
                    donutSlices.map((slice) => (
                      <circle
                        key={slice.name}
                        cx="50" cy="50" r="38" fill="transparent"
                        stroke={slice.color} strokeWidth="11"
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                      />
                    ))
                  }
                </g>
              </svg>
              <div className="ems-donut-center">
                <strong>{totalEmployeesCount}</strong>
                <small>Employees</small>
              </div>
            </div>

            <div className="ems-donut-legend">
              {
                donutSlices.length === 0 ? (
                  <span style={{ color: '#71717a', fontSize: '13px', padding: '16px 0' }}>No employee records found</span>
                ) : (
                  donutSlices.map((slice) => (
                    <div key={slice.name} className="ems-legend-item">
                      <span className="ems-legend-name">
                        <span className="ems-legend-dot" style={{ backgroundColor: slice.color }}></span>
                        {slice.name}
                      </span>
                      <span className="ems-legend-count">{slice.count}</span>
                    </div>
                  ))
                )
              }
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
