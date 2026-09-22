import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

interface EmptyStateProps {
    message: string
    onRetry: () => void
}

export const EmptyState = ({ message, onRetry }: EmptyStateProps) => {
    return (
        <div className="ems-empty-state">
            <div className="ems-empty-icon"><InboxOutlinedIcon sx={{ fontSize: 40 }} /></div>
            <h3>{message}</h3>
            <p>There is nothing to display right now</p>
            <button type="button" className="ems-btn ems-btn-outline" onClick={onRetry}>Retry</button>
        </div>
    )
}