export const Loader = () => { 
    return (
        <div className="ems-loader-container" role="status">
            <div className="ems-spinner"></div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#71717a' }}>Loading...</span>
        </div>
    )
}