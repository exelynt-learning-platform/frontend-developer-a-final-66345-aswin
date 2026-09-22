import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchEmployeeById } from "../features/employees/employeeService"
import { clearError, clearSearchResult } from "../features/employees/employeeSlice"
import { Loader } from "../components/common/Loader"
import { ErrorMessage } from "../components/common/ErrorMessage"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

const SearchEmployee = () => {
  const [searchParams] = useSearchParams()
  const [searchId, setSearchId] = useState("")
  const [lastSearchedId, setLastSearchedId] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { searchResult, loading, error } = useAppSelector((state) => state.emp)

  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('id') || searchParams.get('search')
    if (q && !hasSearched) {
      const trimmed = q.trim()
      setSearchId(trimmed)
      setLastSearchedId(trimmed)
      setHasSearched(true)
      appDispatch(fetchEmployeeById(trimmed))
    }
  }, [searchParams, appDispatch, hasSearched])

  const handleSearch = () => {
    if (searchId.trim() === "") return
    setLastSearchedId(searchId.trim())
    setHasSearched(true)
    appDispatch(fetchEmployeeById(searchId.trim()))
  }

  const handleClear = () => {
    setSearchId("")
    setLastSearchedId("")
    setHasSearched(false)
    appDispatch(clearSearchResult())
    appDispatch(clearError())
  }

  const handleRetry = () => {
    if (searchId.trim() !== "") {
      appDispatch(fetchEmployeeById(searchId.trim()))
    }
  }

  if (loading)
    return <Loader />

  return (
    <div>
      <div className="ems-page-header">
        <div className="ems-page-title">
          <h1>Search Employee</h1>
          <p>Find an employee by ID.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="ems-icon-btn" onClick={handleClear} aria-label="Reset Search"><RefreshOutlinedIcon fontSize="small" /></button>
        </div>
      </div>

      <div className="ems-search-card">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input type="text" className="ems-input" placeholder="search employee" value={searchId} onChange={(e) => setSearchId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          </div>
          <button type="button" className="ems-btn ems-btn-primary" onClick={handleSearch} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          <button type="button" className="ems-btn ems-btn-outline" onClick={handleClear}>Clear</button>
        </div>
      </div>

      {
        error && !loading && (
          <div style={{ marginBottom: '24px' }}>
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )
      }

      {
        hasSearched && !searchResult && !loading && !error && (
          <div className="ems-empty-state">
            <div className="ems-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>No Employee Found</h3>
            <p>We couldn't find any employee with ID &quot;{lastSearchedId}&quot;. Please check the ID and try again.</p>
            <button type="button" className="ems-btn ems-btn-amber" onClick={() => {
              setSearchId("")
              setHasSearched(false)
              appDispatch(clearError())
              appDispatch(clearSearchResult())
            }}>Try Another ID</button>
          </div>
        )
      }

      {
        !hasSearched && !searchResult && !error && !loading && (
          <div className="ems-empty-state" style={{ padding: '48px 24px' }}>
            <div className="ems-empty-icon" style={{ width: '64px', height: '64px', marginBottom: '16px' }}>
              <SearchOutlinedIcon sx={{ fontSize: 32 }} />
            </div>
            <p style={{ margin: 0, fontSize: '15px' }}>Enter an employee ID to search</p>
          </div>
        )
      }

      {
        searchResult && !loading && (
          <div className="ems-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f2f0ea' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Employee Details</h3>
              <span className="ems-status-badge">Found</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="ems-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mail</th>
                    <th>Mobile</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>City</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>{searchResult.id}</strong></td>
                    <td style={{ fontWeight: 600 }}>{searchResult.name}</td>
                    <td>{searchResult.mail}</td>
                    <td>{searchResult.ph_no}</td>
                    <td>{searchResult.country}</td>
                    <td>{searchResult.state}</td>
                    <td>{searchResult.city || 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button type="button" className="ems-action-btn" onClick={() => navigate(`/employees/${searchResult.id}`)} aria-label="View Details"><VisibilityOutlinedIcon sx={{ fontSize: 18 }} /></button>
                        <button type="button" className="ems-action-btn" onClick={() => navigate(`/employees/edit/${searchResult.id}`)} aria-label="Edit"><EditOutlinedIcon sx={{ fontSize: 18 }} /></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default SearchEmployee
