import type { Employee } from '../../types/employee'
import type { Country } from '../../types/country'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { getAvatarUrl, getCountryFlag } from '../../constants/employeeConstants'

export interface EmployeeTableViewProps {
    displayedEmployees: Employee[]
    selectedIds: string[]
    allSelected: boolean
    searchTerm: string
    selectedCountry: string
    countries: Country[]
    totalItems: number
    startIndex: number
    itemsPerPage: number
    currentPage: number
    totalPages: number
    deleteError: string | null
    onSearchChange: (value: string) => void
    onCountryChange: (value: string) => void
    onToggleSelectAll: () => void
    onToggleSelectRow: (id: string) => void
    onView: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string, name: string) => void
    onPageChange: (page: number) => void
    onDismissDeleteError: () => void
}

const EmployeeTableView = ({
    displayedEmployees,
    selectedIds,
    allSelected,
    searchTerm,
    selectedCountry,
    countries,
    totalItems,
    startIndex,
    itemsPerPage,
    currentPage,
    totalPages,
    deleteError,
    onSearchChange,
    onCountryChange,
    onToggleSelectAll,
    onToggleSelectRow,
    onView,
    onEdit,
    onDelete,
    onPageChange,
    onDismissDeleteError
}: EmployeeTableViewProps) => {
    return (
        <div>
            {deleteError && (
                <div
                    role="alert"
                    style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        border: '1px solid #f87171',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <span>{deleteError}</span>
                    <button
                        type="button"
                        onClick={onDismissDeleteError}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#991b1b',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '16px'
                        }}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="ems-filters-row">
                <div className="ems-table-search">
                    <SearchOutlinedIcon className="search-icon" />
                    <input type="text" placeholder="Search by ID, name, email or mobile..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} aria-label="Filter employees" />
                </div>

                <select className="ems-filter-select" value={selectedCountry} onChange={(e) => onCountryChange(e.target.value)} aria-label="Filter by country">
                    <option value="All">All Countries</option>
                    {
                        countries && countries.map((c: Country) => {
                            const name = c.country || c.name || ''
                            return <option key={c.id || name} value={name}>{name}</option>
                        })
                    }
                </select>
            </div>

            <div className="ems-table-container">
                <div style={{ overflowX: 'auto' }}>
                    <table className="ems-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input type="checkbox" className="ems-checkbox" aria-label="Select all employees" checked={allSelected} onChange={onToggleSelectAll} />
                                </th>
                                <th style={{ width: '60px' }}>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Country</th>
                                <th style={{ textAlign: 'center', width: '130px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                displayedEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#71717a' }}>
                                            No employees match your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    displayedEmployees.map((emp, index) => {
                                        const isSelected = selectedIds.includes(emp.id)
                                        const avatarSrc = emp.avatar || getAvatarUrl(emp.id, index)
                                        const flag = getCountryFlag(emp.country)
                                        const emailDisplay = emp.mail || '-'
                                        const mobileDisplay = emp.ph_no || '-'

                                        return (
                                            <tr key={emp.id} style={{ backgroundColor: isSelected ? '#faf9f3' : undefined }}>
                                                <td>
                                                    <input type="checkbox" className="ems-checkbox" aria-label={`Select employee ${emp.name}`} checked={isSelected} onChange={() => onToggleSelectRow(emp.id)} />
                                                </td>
                                                <td><span style={{ fontWeight: 600, color: '#71717a' }}>{emp.id}</span></td>
                                                <td>
                                                    <div className="ems-user-cell">
                                                        <div className="ems-table-avatar">
                                                            <img src={avatarSrc} alt={emp.name} onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none' }} />
                                                            <span>{emp.name ? emp.name.charAt(0).toUpperCase() : 'E'}</span>
                                                        </div>
                                                        <span style={{ fontWeight: 600 }}>{emp.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ color: '#52525b' }}>{emailDisplay}</td>
                                                <td style={{ color: '#52525b' }}>{mobileDisplay}</td>
                                                <td>
                                                    <div className="ems-country-cell">
                                                        <span className="ems-country-flag">{flag}</span>
                                                        <span>{emp.country}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="ems-actions-cell" style={{ justifyContent: 'center' }}>
                                                        <button type="button" className="ems-action-btn" onClick={() => onView(emp.id)} aria-label="View">
                                                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                        <button type="button" className="ems-action-btn" onClick={() => onEdit(emp.id)} aria-label="Edit">
                                                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                                            <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Edit</span>
                                                        </button>
                                                        <button type="button" className="ems-action-btn delete" onClick={() => onDelete(emp.id, emp.name)} aria-label="Delete">
                                                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                                                            <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )
                            }
                        </tbody>
                    </table>
                </div>

                <div className="ems-table-footer">
                    <span className="ems-pagination-info">
                        Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} employees
                    </span>

                    <div className="ems-pagination-controls">
                        <button type="button" className="ems-page-btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Previous page">&lt;</button>
                        {
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} type="button" className={`ems-page-btn ${currentPage === page ? 'active' : ''}`} onClick={() => onPageChange(page)}>{page}</button>
                            ))
                        }
                        <button type="button" className="ems-page-btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Next page">&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeTableView
