import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchEmployees } from '../features/employees/employeeService'
import { fetchCountry } from '../features/countries/countryService'
import { Loader } from '../components/common/Loader'
import { ErrorMessage } from '../components/common/ErrorMessage'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import StatsGrid from '../components/dashboard/StatsGrid'
import BarChartCard from '../components/dashboard/BarChartCard'
import DonutChartCard from '../components/dashboard/DonutChartCard'

const SLICE_COLORS = ['#3b82f6', '#06b6d4', '#eab308', '#ef4444', '#8b5cf6', '#3f3f46']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

  const totalStatesCount = useMemo(() => {
    return new Set(employees.map(e => e.state?.trim()).filter(Boolean)).size
  }, [employees])

  const totalDistrictsCount = useMemo(() => {
    return new Set(employees.map(e => e.city?.trim()).filter(Boolean)).size
  }, [employees])

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
  const donutSlices = useMemo(() => {
    let cumulativeOffset = 0
    return countryBreakdown.map((item, idx) => {
      const fraction = totalEmployeesCount > 0 ? item.count / totalEmployeesCount : 0
      const dashLength = fraction * circumference
      const slice = {
        name: item.name,
        count: item.count,
        color: SLICE_COLORS[idx % SLICE_COLORS.length],
        strokeDasharray: `${dashLength.toFixed(1)} ${(circumference - dashLength).toFixed(1)}`,
        strokeDashoffset: -cumulativeOffset
      }
      cumulativeOffset += dashLength
      return slice
    })
  }, [countryBreakdown, totalEmployeesCount, circumference])

  const monthlyMetrics = useMemo(() => {
    const counts = new Array(12).fill(0)
    employees.forEach(emp => {
      if (emp.joinedDate) {
        const d = new Date(emp.joinedDate)
        if (!isNaN(d.getTime())) {
          counts[d.getMonth()] += 1
          return
        }
      }
      const num = parseInt(emp.id, 10)
      if (!isNaN(num)) {
        counts[num % 12] += 1
      }
    })
    const maxCount = Math.max(...counts, 1)
    return MONTHS.map((month, idx) => {
      const count = counts[idx]
      const heightPct = employees.length > 0 && count > 0
        ? Math.max(20, Math.round((count / maxCount) * 90))
        : (employees.length > 0 ? 15 : 10)
      return { month, count, heightPct }
    })
  }, [employees])

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

      <StatsGrid
        totalEmployees={totalEmployeesCount}
        totalCountries={totalCountriesCount}
        totalStates={totalStatesCount}
        totalDistricts={totalDistrictsCount}
      />

      <div className="ems-dashboard-grid">
        <BarChartCard
          monthlyMetrics={monthlyMetrics}
          activeMonthIndex={activeMonthIndex}
          currentMonthIndex={currentMonthIndex}
          totalEmployees={totalEmployeesCount}
          onHoverMonth={setActiveMonthIndex}
        />

        <DonutChartCard
          donutSlices={donutSlices}
          totalEmployees={totalEmployeesCount}
        />

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
