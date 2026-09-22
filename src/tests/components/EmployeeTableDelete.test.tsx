import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"

import EmployeeTable from "../../components/employee/EmployeeTable"

const mockDispatch = vi.fn()

const mockEmployees = [
    {
        id: "1",
        name: "David",
        mail: "david@example.com",
        ph_no: "9876543212",
        country: "India",
        state: "Tamil Nadu",
        city: "Chennai",
    },
    {
        id: "2",
        name: "John",
        mail: "john@example.com",
        ph_no: "9876543213",
        country: "USA",
        state: "California",
        city: "Los Angeles",
    },
]

let mockEmployeeState = {
    employees: mockEmployees,
    loading: false,
    error: null as string | null,
}

vi.mock("../../app/hooks", () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: (selector: any) =>
        selector({
            emp: mockEmployeeState,
        }),
}))

vi.mock("../../features/employees/employeeService", () => ({
    deleteEmployees: (id: string) => ({
        type: "employee/deleteEmployee",
        payload: id,
    }),

    fetchEmployees: () => ({
        type: "employee/fetchEmployees",
    }),
}))

describe("EmployeeTable Delete", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mockEmployeeState = {
            employees: mockEmployees,
            loading: false,
            error: null,
        }

        vi.spyOn(window, "confirm")
    })

    it("should display employees in the table", () => {
        render(
            <MemoryRouter>
                <EmployeeTable />
            </MemoryRouter>
        )

        expect(screen.getByText("David")).toBeInTheDocument()
        expect(screen.getByText("John")).toBeInTheDocument()
        expect(screen.getByText("david@example.com")).toBeInTheDocument()
        expect(screen.getByText("john@example.com")).toBeInTheDocument()
    })

    it("should ask for confirmation before deleting employee", async () => {
        const user = userEvent.setup()

        vi.mocked(window.confirm).mockReturnValue(false)

        render(
            <MemoryRouter>
                <EmployeeTable />
            </MemoryRouter>
        )

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        expect(window.confirm).toHaveBeenCalledWith(
            "are you sure to delete this employee"
        )
    })

    it("should delete employee when confirmation is accepted", async () => {
        const user = userEvent.setup()

        vi.mocked(window.confirm).mockReturnValue(true)

        render(
            <MemoryRouter>
                <EmployeeTable />
            </MemoryRouter>
        )

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "employee/deleteEmployee",
            payload: "1",
        })
    })

    it("should not delete employee when confirmation is cancelled", async () => {
        const user = userEvent.setup()

        vi.mocked(window.confirm).mockReturnValue(false)

        render(
            <MemoryRouter>
                <EmployeeTable />
            </MemoryRouter>
        )

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        expect(mockDispatch).not.toHaveBeenCalledWith({
            type: "employee/deleteEmployee",
            payload: "1",
        })
    })

    it("should navigate to edit employee page", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={["/employees"]}>
                <Routes>
                    <Route
                        path="/employees"
                        element={<EmployeeTable />}
                    />

                    <Route
                        path="/employees/edit/:id"
                        element={<div>Edit Employee Page</div>}
                    />
                </Routes>
            </MemoryRouter>
        )

        const editButtons = screen.getAllByRole("button", {
            name: "Edit",
        })

        await user.click(editButtons[0])

        expect(screen.getByText("Edit Employee Page")).toBeInTheDocument()
    })
})