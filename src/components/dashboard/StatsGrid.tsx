import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined'

interface StatCardProps {
    icon: React.ReactNode
    iconClass: string
    title: string
    value: number
    trend: string
    subtext: string
}

const StatCard = ({ icon, iconClass, title, value, trend, subtext }: StatCardProps) => (
    <div className="ems-stat-card">
        <div className={`ems-stat-icon ${iconClass}`}>
            {icon}
        </div>
        <div className="ems-stat-details">
            <span className="ems-stat-title">{title}</span>
            <div className="ems-stat-value-row">
                <span className="ems-stat-value">{value}</span>
                <span className="ems-stat-trend">{trend}</span>
            </div>
            <span className="ems-stat-subtext">{subtext}</span>
        </div>
    </div>
)

interface StatsGridProps {
    totalEmployees: number
    totalCountries: number
    totalStates: number
    totalDistricts: number
}

const StatsGrid = ({ totalEmployees, totalCountries, totalStates, totalDistricts }: StatsGridProps) => (
    <div className="ems-stats-grid">
        <StatCard icon={<PeopleOutlinedIcon />} iconClass="green" title="Total Employees" value={totalEmployees} trend="Active" subtext="Registered in directory" />
        <StatCard icon={<PublicOutlinedIcon />} iconClass="blue" title="Countries" value={totalCountries} trend="Global" subtext="Active regions" />
        <StatCard icon={<SecurityOutlinedIcon />} iconClass="red" title="States" value={totalStates} trend="Regional" subtext="Across territories" />
        <StatCard icon={<LocationCityOutlinedIcon />} iconClass="yellow" title="Districts" value={totalDistricts} trend="Local" subtext="Cities &amp; districts" />
    </div>
)

export default StatsGrid
