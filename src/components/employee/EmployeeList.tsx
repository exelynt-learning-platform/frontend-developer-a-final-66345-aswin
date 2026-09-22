import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchEmployeeById } from '../../features/employees/employeeService'
import { useEffect } from 'react'
import { Loader } from '../common/Loader'
import { ErrorMessage } from '../common/ErrorMessage'
import { EmptyState } from '../common/EmptyState'

const EmployeeList = () => {
    const appDispatch = useAppDispatch()
    const navigate = useNavigate()

    const { selectedEmployee, loading, error } = useAppSelector((state) => state.emp)

    const { id } = useParams()
    
    useEffect(() => {
        if(id)
            appDispatch(fetchEmployeeById(id))
    }, [id, appDispatch])

    const handleRetry = () => {
        if(id)
            appDispatch(fetchEmployeeById(id))
    }

    if(loading)
        return <Loader />

    if(error)
        return <ErrorMessage message={error} onRetry={handleRetry}/>

    if(selectedEmployee?.id === null)
        return <EmptyState message='Employee not found' onRetry={handleRetry} />
    
    return (
        <div className='table-responsive'>
            <table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Mail</td>
                        <td>Phone Number</td>
                        <td>Country</td>
                        <td>State</td>
                        <td>City</td>
                    </tr>
                </thead>
                <tbody>
                    <td>{selectedEmployee?.id}</td>
                    <td>{selectedEmployee?.name}</td>
                    <td>{selectedEmployee?.mail}</td>
                    <td>{selectedEmployee?.ph_no}</td>
                    <td>{selectedEmployee?.country}</td>
                    <td>{selectedEmployee?.state}</td>
                    <td>{selectedEmployee?.city}</td>
                    <td>
                        <button className='btn btn-sm btn-primary me-2' onClick={() => navigate(`/employees/edit/${id}`)}>Edit</button>
                        <button className='btn btn-sm btn-secondary' onClick={() => navigate('/employees')}>Back</button>
                    </td>
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeList
