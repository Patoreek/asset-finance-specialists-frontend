import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import SignUp from "./Signup";
import apiClient from "../lib/apiClient";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock apiClient
vi.mock("../lib/apiClient", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("SignUp", () => {
  beforeEach(() => {
    apiClient.post.mockClear();
    mockNavigate.mockClear();
  });

  test("renders signup form correctly", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  test("displays validation errors when submitting empty form", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Please enter a valid email address/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Confirm password must be at least 6 characters long/i)
      ).toBeInTheDocument();
    });
  });

  test("displays error when passwords do not match", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Password$/i), "password1");
    await user.type(screen.getByLabelText(/^Confirm Password$/i), "password2");
    await user.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  test("successful signup navigates to login page", async () => {
    apiClient.post.mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Phone/i), "+1234567890");
    await user.type(screen.getByLabelText(/Address/i), "123 Test St");
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/^Password$/i), "password123");
    await user.type(
      screen.getByLabelText(/^Confirm Password$/i),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(
      () => {
        expect(apiClient.post).toHaveBeenCalledWith("auth/signup", {
          firstName: "John",
          lastName: "Doe",
          phone: "+1234567890",
          address: "123 Test St",
          email: "john.doe@example.com",
          password: "password123",
          confirmPassword: "password123",
        });

        expect(mockNavigate).toHaveBeenCalledWith("/");
      },
      { timeout: 3000 }
    );
  });

  test("failed signup shows error", async () => {
    apiClient.post.mockRejectedValue({
      response: {
        status: 400,
        data: { message: "Email already in use" },
      },
      status: 400,
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Phone/i), "+1234567890");
    await user.type(screen.getByLabelText(/Address/i), "123 Test St");
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/^Password$/i), "password1");
    await user.type(screen.getByLabelText(/^Confirm Password$/i), "password1");
    await user.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("auth/signup", {
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        address: "123 Test St",
        email: "john.doe@example.com",
        password: "password1",
        confirmPassword: "password1",
      });
    });

    const errorMessages = screen.queryAllByText(/Email already in use/i);
    expect(errorMessages.length).toBeGreaterThan(0); // This will pass if the text appears at least once
  });
});
