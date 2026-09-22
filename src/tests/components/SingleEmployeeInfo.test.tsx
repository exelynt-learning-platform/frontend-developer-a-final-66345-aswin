import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import SingleEmployeeInfo from "../../pages/SingleEmployeeInfo"

const mockDispatch = vi.fn()

let mockEmployeeState: {
  selectedEmployee: {
    id: string
    name: string
    mail: string
    ph_no: string
    country: string
    state: string
    city: string
  } | null
  loading: boolean
  error: string | null
} = {
  selectedEmployee: null,
  loading: false,
  error: null,
}

interface MockSingleStore {
  emp: typeof mockEmployeeState
}

vi.mock("../../app/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: (state: MockSingleStore) => T): T =>
    selector({
      emp: mockEmployeeState,
    }),
}))

vi.mock("../../features/employees/employeeService", () => ({
  fetchEmployeeById: (id: string) => ({
    type: "employee/fetchEmployeeById",
    payload: id,
  }),
}))

describe("SingleEmployeeInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockEmployeeState = {
      selectedEmployee: null,
      loading: false,
      error: null,
    }
  })

  it("should fetch employee by ID", () => {
    render(
      <MemoryRouter initialEntries={["/employees/5"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "employee/fetchEmployeeById",
      payload: "5",
    })
  })

  it("should display employee details", () => {
    mockEmployeeState = {
      selectedEmployee: {
        id: "5",
        name: "David",
        mail: "david@example.com",
        ph_no: "9876543212",
        country: "India",
        state: "Tamil Nadu",
        city: "Chennai",
      },
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={["/employees/5"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText("Employee info")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("David")).toBeInTheDocument()
    expect(screen.getByText("david@example.com")).toBeInTheDocument()
    expect(screen.getByText("9876543212")).toBeInTheDocument()
    expect(screen.getByText("India")).toBeInTheDocument()
    expect(screen.getByText("Tamil Nadu")).toBeInTheDocument()
    expect(screen.getByText("Chennai")).toBeInTheDocument()
  })

  it("should display loading state", () => {
    mockEmployeeState = {
      selectedEmployee: null,
      loading: true,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={["/employees/5"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("should display error state", () => {
    mockEmployeeState = {
      selectedEmployee: null,
      loading: false,
      error: "Failed to fetch employee",
    }

    render(
      <MemoryRouter initialEntries={["/employees/5"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText("Failed to fetch employee")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: /retry/i })
    ).toBeInTheDocument()
  })

  it("should display employee not found", () => {
    mockEmployeeState = {
      selectedEmployee: null,
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={["/employees/999"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText("Employee not found")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: /retry/i })
    ).toBeInTheDocument()
  })

  it("should retry fetching employee", async () => {
    const user = userEvent.setup()

    mockEmployeeState = {
      selectedEmployee: null,
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={["/employees/5"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />
        </Routes>
      </MemoryRouter>
    )

    mockDispatch.mockClear()

    await user.click(
      screen.getByRole("button", { name: /retry/i })
    )

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "employee/fetchEmployeeById",
      payload: "5",
    })
  })

  it("should navigate to edit employee page", async () => {
    const user = userEvent.setup()

    mockEmployeeState = {
      selectedEmployee: {
        id: "5",
        name: "David",
        mail: "david@example.com",
        ph_no: "9876543212",
        country: "India",
        state: "Tamil Nadu",
        city: "Chennai",
      },
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={["/employees/5"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />

          <Route
            path="/employees/edit/:id"
            element={<div>Edit Employee Page</div>}
          />
        </Routes>
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole("button", { name: "Edit Employee" })
    )

    expect(
      screen.getByText("Edit Employee Page")
    ).toBeInTheDocument()
  })

  it("should navigate back to employees page", async () => {
    const user = userEvent.setup()

    mockEmployeeState = {
      selectedEmployee: {
        id: "5",
        name: "David",
        mail: "david@example.com",
        ph_no: "9876543212",
        country: "India",
        state: "Tamil Nadu",
        city: "Chennai",
      },
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={["/employees/5"]}>
        <Routes>
          <Route
            path="/employees/:id"
            element={<SingleEmployeeInfo />}
          />

          <Route
            path="/employees"
            element={<div>Employees Page</div>}
          />
        </Routes>
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole("button", { name: "Back" })
    )

    expect(
      screen.getByText("Employees Page")
    ).toBeInTheDocument()
  })
})