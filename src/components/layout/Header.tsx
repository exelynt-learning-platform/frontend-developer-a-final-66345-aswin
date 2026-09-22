import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'

const Header = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) 
            navigate(`/employees?search=${encodeURIComponent(searchTerm.trim())}`)
    }

    return (
        <header className="ems-header">
            <form className="ems-header-search" onSubmit={handleSearchSubmit}>
                <SearchOutlinedIcon className="search-icon" />
                <input type="text" placeholder="Search employees by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search employees" />
            </form>

            <div className="ems-header-actions">
                <button type="button" className="ems-icon-btn" aria-label="Select Language" title="Language"><LanguageOutlinedIcon fontSize="small" /></button>
                <button type="button" className="ems-icon-btn" aria-label="Toggle Theme" title="Theme"><DarkModeOutlinedIcon fontSize="small" /></button>
                <button type="button" className="ems-icon-btn" aria-label="Notifications" title="Notifications">
                    <NotificationsNoneOutlinedIcon fontSize="small" />
                    <span className="badge-dot"></span>
                </button>
            </div>
        </header>
    )
}

export default Header