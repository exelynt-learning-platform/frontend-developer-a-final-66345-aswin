import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StatsGrid from '../../components/dashboard/StatsGrid'
import BarChartCard from '../../components/dashboard/BarChartCard'
import DonutChartCard from '../../components/dashboard/DonutChartCard'

describe('Dashboard subcomponents (presentational)', () => {
  describe('StatsGrid', () => {
    it('renders all four stat cards with correct values', () => {
      render(
        <StatsGrid
          totalEmployees={15}
          totalCountries={4}
          totalStates={8}
          totalDistricts={12}
        />
      )

      expect(screen.getByText('Total Employees')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()

      expect(screen.getByText('Countries')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()

      expect(screen.getByText('States')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()

      expect(screen.getByText('Districts')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })
  })

  describe('BarChartCard', () => {
    it('renders monthly bars and triggers onHoverMonth', () => {
      const handleHover = vi.fn()
      const metrics = [
        { month: 'Jan', count: 5, heightPct: 50 },
        { month: 'Feb', count: 8, heightPct: 80 }
      ]

      render(
        <BarChartCard
          monthlyMetrics={metrics}
          activeMonthIndex={1}
          currentMonthIndex={1}
          totalEmployees={8}
          onHoverMonth={handleHover}
        />
      )

      expect(screen.getByText('Team Overview')).toBeInTheDocument()
      expect(screen.getByText('Jan')).toBeInTheDocument()
      expect(screen.getByText('Feb')).toBeInTheDocument()

      const janLabel = screen.getByText('Jan')
      fireEvent.mouseEnter(janLabel.parentElement!)
      expect(handleHover).toHaveBeenCalledWith(0)
    })
  })

  describe('DonutChartCard', () => {
    it('renders donut chart with slices and legend', () => {
      const slices = [
        { name: 'India', count: 10, color: '#3b82f6', strokeDasharray: '150 88', strokeDashoffset: 0 },
        { name: 'USA', count: 5, color: '#06b6d4', strokeDasharray: '88 150', strokeDashoffset: -150 }
      ]

      render(<DonutChartCard donutSlices={slices} totalEmployees={15} />)

      expect(screen.getByText('Employees by Country')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('India')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('USA')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('renders empty fallback when donutSlices is empty', () => {
      render(<DonutChartCard donutSlices={[]} totalEmployees={0} />)
      expect(screen.getByText('No employee records found')).toBeInTheDocument()
    })
  })
})
