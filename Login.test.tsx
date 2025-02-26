import { render, screen, fireEvent } from "@testing-library/react"
import { Login } from "./Login"

jest.mock("../store/userStore", () => ({
  useUserStore: () => ({
    login: jest.fn(),
    isLoading: false,
    error: null,
  }),
}))

describe("Login", () => {
  it("renders login form", () => {
    render(<Login />)
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument()
  })

  it("handles form submission", () => {
    const mockLogin = jest.fn()
    jest.spyOn(require("../store/userStore"), "useUserStore").mockImplementation(() => ({
      login: mockLogin,
      isLoading: false,
      error: null,
    }))

    render(<Login />)
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } })
    fireEvent.click(screen.getByRole("button", { name: "Log in" }))

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123")
  })
})

