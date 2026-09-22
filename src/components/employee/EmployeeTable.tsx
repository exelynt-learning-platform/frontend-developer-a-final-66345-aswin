import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { deleteEmployees, fetchEmployees } from '../../features/employees/employeeService'
import { Loader } from '../common/Loader'
import { ErrorMessage } from '../common/ErrorMessage'
import { EmptyState } from '../common/EmptyState'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DeleteDialog from './DeleteDialog'
import { DEFAULT_PAGE_SIZE, getAvatarUrl, getCountryFlag } from '../../constants/employeeConstants'

const EmployeeTable = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const appDispatch = useAppDispatch()

    const { employees, loading, error } = useAppSelector((state) => state.emp)
    const { country } = useAppSelector((state) => state.country)

    const urlQuery = searchParams.get('search') || searchParams.get('query') || ''
    const [searchTerm, setSearchTerm] = useState(urlQuery)
    const [selectedCountry, setSelectedCountry] = useState('All')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const q = searchParams.get('search') || searchParams.get('query')
        if (q !== null && q !== searchTerm) {
            setSearchTerm(q)
            setCurrentPage(1)
        }
    }, [searchParams])
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
    const itemsPerPage = DEFAULT_PAGE_SIZE

    const handleDel = (id: string, name: string) => {
        setDeleteTarget({ id, name })
    }

    const handleConfirmDelete = (id: string) => {
        appDispatch(deleteEmployees(id))
        setDeleteTarget(null)
    }

    const handleCloseDelete = () => {
        setDeleteTarget(null)
    }

    const handleRetry = () => {
        appDispatch(fetchEmployees())
    }

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch =
                (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (emp.mail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (emp.ph_no || '').includes(searchTerm) ||
                (emp.id || '').toString().includes(searchTerm)

            const matchesCountry =
                selectedCountry === 'All' ||
                (emp.country || '').toLowerCase() === selectedCountry.toLowerCase()

            return matchesSearch && matchesCountry
        })
    }, [employees, searchTerm, selectedCountry])

    const totalItems = filteredEmployees.length
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * itemsPerPage
    const displayedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage)

    const allSelected = displayedEmployees.length > 0 && displayedEmployees.every(e => selectedIds.includes(e.id))

    // Reset selection when search, country filter, or page changes
    useEffect(() => {
        setSelectedIds([])
    }, [searchTerm, selectedCountry, safeCurrentPage])

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(displayedEmployees.map(e => e.id))
        }
    }

    const toggleSelectRow = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    if (loading)
        return <Loader />
    if (error)
        return <ErrorMessage message={error} onRetry={handleRetry} />
    if (employees.length === 0)
        return <EmptyState message="Employee not found" onRetry={handleRetry} />

    return (
        <div>
            <div className="ems-filters-row">
                <div className="ems-table-search">
                    <SearchOutlinedIcon className="search-icon" />
                    <input type="text" placeholder="Search by ID, name, email or mobile..." value={searchTerm} onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }} aria-label="Filter employees" />
                </div>

                <select className="ems-filter-select" value={selectedCountry} onChange={(e) => {
                    setSelectedCountry(e.target.value)
                    setCurrentPage(1)
                }} aria-label="Filter by country">
                    <option value="All">All Countries</option>
                    {
                        country && country.map((c: any) => {
                            const name = c.country || c.name
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
                                    <input type="checkbox" className="ems-checkbox" aria-label="Select all employees" checked={allSelected} onChange={toggleSelectAll} />
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
                                                    <input type="checkbox" className="ems-checkbox" aria-label={`Select employee ${emp.name}`} checked={isSelected} onChange={() => toggleSelectRow(emp.id)} />
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
                                                        <button type="button" className="ems-action-btn" onClick={() => navigate(`/employees/${emp.id}`)} aria-label="View">
                                                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                        <button type="button" className="ems-action-btn" onClick={() => navigate(`/employees/edit/${emp.id}`)} aria-label="Edit">
                                                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                                            <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Edit</span>
                                                        </button>
                                                        <button type="button" className="ems-action-btn delete" onClick={() => handleDel(emp.id, emp.name)} aria-label="Delete">
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
                        <button type="button" className="ems-page-btn" disabled={safeCurrentPage <= 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} aria-label="Previous page">&lt;</button>
                        {
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} type="button" className={`ems-page-btn ${safeCurrentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                            ))
                        }
                        <button type="button" className="ems-page-btn" disabled={safeCurrentPage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} aria-label="Next page">&gt;</button>
                    </div>
                </div>
            </div>

            {deleteTarget && (
                <DeleteDialog
                    empId={deleteTarget.id}
                    empName={deleteTarget.name}
                    onClose={handleCloseDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    )
}

export default EmployeeTable
