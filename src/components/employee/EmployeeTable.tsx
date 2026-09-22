import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { deleteEmployees, fetchEmployees } from '../../features/employees/employeeService'
import { clearDeleteError } from '../../features/employees/employeeSlice'
import { Loader } from '../common/Loader'
import { ErrorMessage } from '../common/ErrorMessage'
import { EmptyState } from '../common/EmptyState'
import { DEFAULT_PAGE_SIZE } from '../../constants/employeeConstants'
import DeleteDialog from './DeleteDialog'
import EmployeeTableView from './EmployeeTableView'

const EmployeeTable = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const appDispatch = useAppDispatch()

    const { employees, loading, error, deleteError } = useAppSelector((state) => state.emp)
    const { country } = useAppSelector((state) => state.country)

    const urlQuery = searchParams.get('search') || searchParams.get('query') || ''
    const [searchTerm, setSearchTerm] = useState(urlQuery)
    const [selectedCountry, setSelectedCountry] = useState('All')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const lastQueryRef = useRef(urlQuery)

    useEffect(() => {
        const q = searchParams.get('search') || searchParams.get('query') || ''
        if (q !== lastQueryRef.current) {
            lastQueryRef.current = q
            setSearchTerm(q)
            setCurrentPage(1)
        }
    }, [searchParams])

    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
    const itemsPerPage = DEFAULT_PAGE_SIZE

    const handleDel = (id: string, name: string) => {
        setDeleteTarget({ id, name })
    }

    const handleConfirmDelete = async (id: string) => {
        setDeleteTarget(null)
        try {
            await appDispatch(deleteEmployees(id)).unwrap()
        } catch {
            // deleteError state is set by the slice — visible via EmployeeTableView
        }
    }

    const handleCloseDelete = () => {
        setDeleteTarget(null)
    }

    const handleRetry = () => {
        appDispatch(fetchEmployees())
    }

    const handleDismissDeleteError = () => {
        appDispatch(clearDeleteError())
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

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value)
        setCurrentPage(1)
    }

    if (loading)
        return <Loader />
    if (error)
        return <ErrorMessage message={error} onRetry={handleRetry} />
    if (employees.length === 0)
        return <EmptyState message="Employee not found" onRetry={handleRetry} />

    return (
        <>
            <EmployeeTableView
                displayedEmployees={displayedEmployees}
                selectedIds={selectedIds}
                allSelected={allSelected}
                searchTerm={searchTerm}
                selectedCountry={selectedCountry}
                countries={country}
                totalItems={totalItems}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                deleteError={deleteError}
                onSearchChange={handleSearchChange}
                onCountryChange={handleCountryChange}
                onToggleSelectAll={toggleSelectAll}
                onToggleSelectRow={toggleSelectRow}
                onView={(id) => navigate(`/employees/${id}`)}
                onEdit={(id) => navigate(`/employees/edit/${id}`)}
                onDelete={handleDel}
                onPageChange={setCurrentPage}
                onDismissDeleteError={handleDismissDeleteError}
            />

            {deleteTarget && (
                <DeleteDialog
                    empId={deleteTarget.id}
                    empName={deleteTarget.name}
                    onClose={handleCloseDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    )
}

export default EmployeeTable
