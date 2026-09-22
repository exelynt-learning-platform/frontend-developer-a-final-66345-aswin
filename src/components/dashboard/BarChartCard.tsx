interface MonthlyMetric {
    month: string
    count: number
    heightPct: number
}

interface BarChartCardProps {
    monthlyMetrics: MonthlyMetric[]
    activeMonthIndex: number
    currentMonthIndex: number
    totalEmployees: number
    onHoverMonth: (index: number) => void
}

const BarChartCard = ({ monthlyMetrics, activeMonthIndex, currentMonthIndex, totalEmployees, onHoverMonth }: BarChartCardProps) => (
    <div className="ems-chart-card">
        <div className="ems-chart-header">
            <h3>Team Overview</h3>
        </div>
        <div className="ems-bar-chart">
            {
                monthlyMetrics.map((item, idx) => {
                    const isActive = activeMonthIndex === idx
                    return (
                        <div key={item.month} className={`ems-bar-col ${isActive ? 'active' : ''}`} onMouseEnter={() => onHoverMonth(idx)}>
                            {
                                isActive && (
                                    <div className="tooltip-bubble">
                                        {idx === currentMonthIndex ? `${totalEmployees} Employees (Current)` : `${item.count} Employees`}
                                    </div>
                                )
                            }
                            <div className="ems-bar-pillar" style={{ height: `${item.heightPct}%` }}></div>
                            <span className="ems-bar-label">{item.month}</span>
                        </div>
                    )
                })
            }
        </div>
    </div>
)

export default BarChartCard
