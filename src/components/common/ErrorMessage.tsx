import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined'

interface ErrorMessageProps {
    message: string
    onRetry: () => void
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
    <div style={{ maxWidth: '640px', margin: '16px auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b91c1c' }}>
                <ErrorOutlineIcon />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{message}</span>
            </div>
            <button type="button" className="ems-btn ems-btn-outline ems-btn-sm" onClick={onRetry} style={{ color: '#b91c1c', borderColor: '#fca5a5' }}>Retry</button>
        </div>
    </div>
)