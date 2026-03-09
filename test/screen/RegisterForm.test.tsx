/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import { handleRegister } from "@/lib/action/auth-action";

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
  handleRegister: jest.fn(),
}));

// --- Typed Mocks ---
const mockHandleRegister = handleRegister as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;

// --- Test Data ---
const mockProps = {
  onOpenLogin: jest.fn(),
};

const createMockResponse = (success: boolean, data: any, message = "") => ({
  success,
  data,
  message,
});

const fillForm = async ({
  username = "testuser",
  email = "test@example.com",
  password = "Secret@123",
  confirm = "Secret@123",
} = {}) => {
  if (username)
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: username },
    });
  if (email)
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: email },
    });
  if (password)
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: password },
    });
  if (confirm)
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: confirm },
    });
};

// --- Tests ---
describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────
  describe("Rendering", () => {
    it("renders the logo image", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.getByAltText("logo")).toBeInTheDocument();
    });

    it("renders the Join BinBuddy heading", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.getByText("Join BinBuddy")).toBeInTheDocument();
    });

    it("renders all input fields", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    });

    it("renders the Create Account button", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    });

    it("renders the Sign In link", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("does not show error message initially", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
    });
  });

  // ── Password Visibility Toggle ────────────────────────────────────────────
  describe("Password visibility toggle", () => {
    it("hides password by default", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "password");
    });

    it("shows password when Show is clicked", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.click(screen.getByRole("button", { name: /show/i }));
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "text");
    });

    it("toggles back to hidden when Hide is clicked", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.click(screen.getByRole("button", { name: /show/i }));
      fireEvent.click(screen.getByRole("button", { name: /hide/i }));
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute("type", "password");
    });
  });

  // ── Password Strength Meter ───────────────────────────────────────────────
  describe("Password strength meter", () => {
    it("is hidden when password is empty", () => {
      render(<RegisterForm {...mockProps} />);
      expect(screen.queryByText(/strength/i)).not.toBeInTheDocument();
    });

    it("shows 'Too weak' for a single-character password", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "a" },
      });
      expect(screen.getByText(/too weak/i)).toBeInTheDocument();
    });

    it("shows 'Strong' for a password meeting all criteria", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Secret@123" },
      });
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });
  });

  // ── Password Match Validation ─────────────────────────────────────────────
  describe("Password match validation", () => {
    it("shows mismatch error when passwords differ", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Secret@123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Different1" },
      });
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it("does not show mismatch error when passwords match", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Secret@123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "Secret@123" },
      });
      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    });

    it("disables submit button when passwords don't match", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "Secret@123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "WrongPass" },
      });
      expect(screen.getByRole("button", { name: /create account/i })).toBeDisabled();
    });
  });

  // ── Prop Callbacks ────────────────────────────────────────────────────────
  describe("Prop callbacks", () => {
    it("calls onOpenLogin when Sign In button is clicked", () => {
      render(<RegisterForm {...mockProps} />);
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      expect(mockProps.onOpenLogin).toHaveBeenCalledTimes(1);
    });
  });

  // ── Successful Registration ───────────────────────────────────────────────
  describe("Successful registration", () => {
    it("calls handleRegister with correct payload", async () => {
      mockHandleRegister.mockResolvedValue(createMockResponse(true, {}));
      render(<RegisterForm {...mockProps} />);
      await fillForm();
      await userEvent.click(screen.getByRole("button", { name: /create account/i }));
      await waitFor(() => {
        expect(mockHandleRegister).toHaveBeenCalledWith({
          username: "testuser",
          email: "test@example.com",
          password: "Secret@123",
          role: "user",
        });
      });
    });

    it("shows success toast after registration", async () => {
      mockHandleRegister.mockResolvedValue(createMockResponse(true, {}));
      render(<RegisterForm {...mockProps} />);
      await fillForm();
      await userEvent.click(screen.getByRole("button", { name: /create account/i }));
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Account created successfully 🌿"
        );
      });
    });

    it("calls onOpenLogin after successful registration", async () => {
      mockHandleRegister.mockResolvedValue(createMockResponse(true, {}));
      render(<RegisterForm {...mockProps} />);
      await fillForm();
      await userEvent.click(screen.getByRole("button", { name: /create account/i }));
      await waitFor(() => {
        expect(mockProps.onOpenLogin).toHaveBeenCalled();
      });
    });
  });

  // ── Failed Registration ───────────────────────────────────────────────────
  describe("Failed registration", () => {
    it("shows error message when registration fails", async () => {
      mockHandleRegister.mockResolvedValue(
        createMockResponse(false, null, "Email already in use")
      );
      render(<RegisterForm {...mockProps} />);
      await fillForm();
      await userEvent.click(screen.getByRole("button", { name: /create account/i }));
      await waitFor(() => {
        expect(screen.getByText("Email already in use")).toBeInTheDocument();
      });
    });

    it("shows error toast on failed registration", async () => {
      mockHandleRegister.mockResolvedValue(
        createMockResponse(false, null, "Duplicate email")
      );
      render(<RegisterForm {...mockProps} />);
      await fillForm();
      await userEvent.click(screen.getByRole("button", { name: /create account/i }));
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith("Duplicate email");
      });
    });

    it("shows error when handleRegister throws", async () => {
      mockHandleRegister.mockRejectedValue(new Error("Server unavailable"));
      render(<RegisterForm {...mockProps} />);
      await fillForm();
      await userEvent.click(screen.getByRole("button", { name: /create account/i }));
      await waitFor(() => {
        expect(screen.getByText("Server unavailable")).toBeInTheDocument();
      });
    });
  });

  // ── Loading State ─────────────────────────────────────────────────────────
  describe("Loading state", () => {
    it("shows 'Creating account...' and disables button while submitting", async () => {
      mockHandleRegister.mockImplementation(() => new Promise(() => {}));
      render(<RegisterForm {...mockProps} />);
      await fillForm();
      fireEvent.submit(
        screen.getByRole("button", { name: /create account/i }).closest("form")!
      );
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /creating account/i })
        ).toBeDisabled();
      });
    });
  });
});