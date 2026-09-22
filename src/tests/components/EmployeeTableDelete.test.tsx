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
            country: { country: [] },
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

    it("should open DeleteDialog confirmation before deleting employee", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <EmployeeTable />
            </MemoryRouter>
        )

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        expect(screen.getByText("Delete Employee")).toBeInTheDocument()
        expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument()
    })

    it("should delete employee when confirmation is accepted", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <EmployeeTable />
            </MemoryRouter>
        )

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        const dialogDeleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })
        // The confirmation button inside the dialog
        await user.click(dialogDeleteButtons[dialogDeleteButtons.length - 1])

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "employee/deleteEmployee",
            payload: "1",
        })
    })

    it("should not delete employee when confirmation is cancelled", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <EmployeeTable />
            </MemoryRouter>
        )

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        const cancelButton = screen.getByRole("button", { name: "Cancel" })
        await user.click(cancelButton)

        expect(mockDispatch).not.toHaveBeenCalledWith({
            type: "employee/deleteEmployee",
            payload: "1",
        })
        expect(screen.queryByText("Delete Employee")).not.toBeInTheDocument()
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