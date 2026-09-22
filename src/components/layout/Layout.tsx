import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"

const Layout = () => {
  return (
    <div className="ems-layout">
        <Sidebar />
        <main className="ems-content">
            <Header />
            <div className="ems-page">
                <Outlet />
            </div>
        </main>
    </div>
  )
}

export default Layout
