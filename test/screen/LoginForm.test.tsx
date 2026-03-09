/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import LoginForm from "@/app/(auth)/_components/LoginForm";
import { handleLogin } from "@/lib/action/auth-action";

// --- Mocks ---
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("@/lib/action/auth-action", () => ({
  handleLogin: jest.fn(),
}));

// --- Typed Mocks ---
const mockHandleLogin = handleLogin as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;

// --- Test Data ---
const mockProps = {
  onOpenRegister: jest.fn(),
  onForgotPassword: jest.fn(),
};

const createMockResponse = (success: boolean, data: any, message = "") => ({
  success,
  data,
  message,
});

// --- Tests ---
describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────
  describe("Rendering", () => {
    it("renders the logo image", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.getByAltText("logo")).toBeInTheDocument();
    });

    it("renders the welcome heading", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });

    it("renders email and password inputs", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    it("renders the Log In button", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    });

    it("renders Forgot Password button", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.getByRole("button", { name: /forgot password/i })).toBeInTheDocument();
    });

    it("renders Register link", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });

    it("does not show error message initially", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
    });
  });

  // ── Password Visibility Toggle ────────────────────────────────────────────
  describe("Password visibility toggle", () => {
    it("hides password by default", () => {
      render(<LoginForm {...mockProps} />);
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "password");
    });

    it("shows password when Show is clicked", () => {
      render(<LoginForm {...mockProps} />);
      fireEvent.click(screen.getByRole("button", { name: /show/i }));
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "text");
    });

    it("hides password again when Hide is clicked", () => {
      render(<LoginForm {...mockProps} />);
      fireEvent.click(screen.getByRole("button", { name: /show/i }));
      fireEvent.click(screen.getByRole("button", { name: /hide/i }));
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "password");
    });
  });

  // ── Prop Callbacks ────────────────────────────────────────────────────────
  describe("Prop callbacks", () => {
    it("calls onOpenRegister when Register button is clicked", () => {
      render(<LoginForm {...mockProps} />);
      fireEvent.click(screen.getByRole("button", { name: /register/i }));
      expect(mockProps.onOpenRegister).toHaveBeenCalledTimes(1);
    });

    it("calls onForgotPassword when Forgot Password is clicked", () => {
      render(<LoginForm {...mockProps} />);
      fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
      expect(mockProps.onForgotPassword).toHaveBeenCalledTimes(1);
    });
  });

  // ── Failed Login ──────────────────────────────────────────────────────────
  describe("Failed login", () => {
    it("displays error message when login fails", async () => {
      mockHandleLogin.mockResolvedValue(
        createMockResponse(false, null, "Invalid credentials")
      );
      render(<LoginForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "WrongPass1" },
      });
      await userEvent.click(screen.getByRole("button", { name: /log in/i }));
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    it("shows error toast when login fails", async () => {
      mockHandleLogin.mockResolvedValue(
        createMockResponse(false, null, "Invalid credentials")
      );
      render(<LoginForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "WrongPass1" },
      });
      await userEvent.click(screen.getByRole("button", { name: /log in/i }));
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith("Invalid credentials");
      });
    });

    it("displays error when handleLogin throws", async () => {
      mockHandleLogin.mockRejectedValue(new Error("Network error"));
      render(<LoginForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Secret@123" },
      });
      await userEvent.click(screen.getByRole("button", { name: /log in/i }));
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });
  });

  // ── Successful Login ──────────────────────────────────────────────────────
  describe("Successful login", () => {
    it("shows success toast on login", async () => {
      mockHandleLogin.mockResolvedValue(
        createMockResponse(true, { role: "user" })
      );
      render(<LoginForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Secret@123" },
      });
      await userEvent.click(screen.getByRole("button", { name: /log in/i }));
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith("Login successful 🌿");
      });
    });
  });

  // ── Loading State ─────────────────────────────────────────────────────────
  describe("Loading state", () => {
    it("disables submit button while logging in", async () => {
      mockHandleLogin.mockImplementation(() => new Promise(() => {}));
      render(<LoginForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "user@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Secret@123" },
      });
      fireEvent.submit(
        screen.getByRole("button", { name: /log in/i }).closest("form")!
      );
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
      });
    });
  });
});