import { useNavigate } from "react-router-dom"

export const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="ems-error-screen">
            <div className="ems-error-card">
                <div className="ems-error-badge">
                    <svg width="44" height="54" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <div className="alert-mark">!</div>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Something Went Wrong!</h2>
                <p style={{ fontSize: '13px', color: '#71717a', maxWidth: '300px', marginBottom: '28px' }}>We encountered an unexpected error. Please try again later</p>
                <button type="button" className="ems-btn ems-btn-primary" onClick={() => navigate("/main")}>Go to Dashboard</button>
            </div>
        </div>
    )
}