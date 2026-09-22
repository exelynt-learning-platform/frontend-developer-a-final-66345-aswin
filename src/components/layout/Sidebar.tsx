import { NavLink } from "react-router-dom"
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined"
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import AddIcon from '@mui/icons-material/Add'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

const Sidebar = () => {
  return (
    <aside className="ems-sidebar">
      <NavLink to="/main" className="ems-logo">
        <div className="ems-logo-mark">
          <img src="/exelynt-logo.png" alt="Exelynt" className="ems-logo-img" />
        </div>
        <div className="ems-brand-text">
          <span className="ems-brand-title">Exelynt</span>
          <span className="ems-brand-subtitle">EMS</span>
        </div>
      </NavLink>

      <nav className="ems-nav">
        <NavLink to="/main" className={({ isActive }) => `ems-nav-link ${isActive ? "active" : ""}`}>
          <DashboardOutlinedIcon />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employees" end className={({ isActive }) => `ems-nav-link ${isActive ? "active" : ""}`}>
          <PeopleOutlinedIcon />
          <span>Employees</span>
        </NavLink>

        <NavLink to="/employees/add" className={({ isActive }) => `ems-nav-link ${isActive ? "active" : ""}`}>
          <AddIcon />
          <span>Add Employee</span>
        </NavLink>

        <NavLink to="/employees/search" className={({ isActive }) => `ems-nav-link ${isActive ? "active" : ""}`}>
          <SearchOutlinedIcon />
          <span>Search</span>
        </NavLink>

        <NavLink to="/main" end={false} className={({ isActive }) => `ems-nav-link ${isActive ? "" : ""}`}>
          <BarChartOutlinedIcon />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/main" end={false} className={({ isActive }) => `ems-nav-link ${isActive ? "" : ""}`}>
          <SettingsOutlinedIcon />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="ems-sidebar-bottom">
        <div className="ems-user-avatar">
          <span>AD</span>
        </div>
        <div className="ems-user-info">
          <strong>Administrator</strong>
          <small>Admin</small>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
