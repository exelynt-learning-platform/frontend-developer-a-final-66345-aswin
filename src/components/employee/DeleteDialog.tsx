import { useEffect, useRef } from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

interface DeleteDialogProps {
    empId: string
    empName: string
    onClose: () => void
    onConfirm: (id: string) => void
}

const DeleteDialog = ({ empId, empName, onClose, onConfirm }: DeleteDialogProps) => {
    const cancelButtonRef = useRef<HTMLButtonElement>(null)
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        cancelButtonRef.current?.focus()

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
            if (e.key === 'Tab' && dialogRef.current) {
                const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
                if (focusableElements.length === 0) return

                const firstElement = focusableElements[0]
                const lastElement = focusableElements[focusableElements.length - 1]

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    return (
        <div 
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(24, 24, 27, 0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1050,
                padding: '16px'
            }}
            onClick={onClose}
        >
            <div 
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                className="ems-card" 
                style={{ 
                    maxWidth: '440px', 
                    width: '100%',
                    padding: '32px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <DeleteOutlineOutlinedIcon />
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#71717a',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                        aria-label="Close dialog"
                    >
                        <CloseOutlinedIcon fontSize="small" />
                    </button>
                </div>

                <h3 id="delete-dialog-title" style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Delete Employee</h3>
                <p style={{ fontSize: '14px', color: '#52525b', marginBottom: '24px', lineHeight: 1.5 }}>
                    Are you sure you want to delete <strong>{empName}</strong>? This action cannot be undone and will remove the employee record.
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button 
                        ref={cancelButtonRef}
                        type="button" 
                        className="ems-btn ems-btn-outline" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="ems-btn"
                        style={{ backgroundColor: '#ef4444', color: '#ffffff', borderColor: '#ef4444' }}
                        onClick={() => onConfirm(empId)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteDialog
