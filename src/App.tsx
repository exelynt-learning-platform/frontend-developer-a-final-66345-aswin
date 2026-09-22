import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import AddEmployee from "./pages/AddEmployee"
import EditEmployee from "./pages/EditEmployee"
import SearchEmployee from "./pages/SearchEmployee"
import Layout from "./components/layout/Layout"
import { NotFound } from "./constants/NotFound"
import SingleEmployeeInfo from "./pages/SingleEmployeeInfo"

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/main" replace />} />
                    <Route path="/main" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/employees/add" element={<AddEmployee />} />
                    <Route path="/employees/edit/:id" element={<EditEmployee />} />
                    <Route path="/employees/:id" element={<SingleEmployeeInfo />} />
                    <Route path="/employees/search" element={<SearchEmployee />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
