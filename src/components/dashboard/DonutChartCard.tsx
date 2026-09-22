interface DonutSlice {
    name: string
    count: number
    color: string
    strokeDasharray: string
    strokeDashoffset: number
}

interface DonutChartCardProps {
    donutSlices: DonutSlice[]
    totalEmployees: number
}

const DonutChartCard = ({ donutSlices, totalEmployees }: DonutChartCardProps) => (
    <div className="ems-chart-card">
        <div className="ems-chart-header">
            <h3>Employees by Country</h3>
        </div>

        <div className="ems-donut-wrapper">
            <div className="ems-donut-visual">
                <svg width="140" height="140" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f4f3ee" strokeWidth="11" />
                    <g transform="rotate(-90 50 50)">
                        {
                            donutSlices.map((slice) => (
                                <circle
                                    key={slice.name}
                                    cx="50" cy="50" r="38" fill="transparent"
                                    stroke={slice.color} strokeWidth="11"
                                    strokeDasharray={slice.strokeDasharray}
                                    strokeDashoffset={slice.strokeDashoffset}
                                />
                            ))
                        }
                    </g>
                </svg>
                <div className="ems-donut-center">
                    <strong>{totalEmployees}</strong>
                    <small>Employees</small>
                </div>
            </div>

            <div className="ems-donut-legend">
                {
                    donutSlices.length === 0 ? (
                        <span style={{ color: '#71717a', fontSize: '13px', padding: '16px 0' }}>No employee records found</span>
                    ) : (
                        donutSlices.map((slice) => (
                            <div key={slice.name} className="ems-legend-item">
                                <span className="ems-legend-name">
                                    <span className="ems-legend-dot" style={{ backgroundColor: slice.color }}></span>
                                    {slice.name}
                                </span>
                                <span className="ems-legend-count">{slice.count}</span>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    </div>
)

export default DonutChartCard
