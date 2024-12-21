import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
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

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Login", () => {
  beforeEach(() => {
    apiClient.post.mockClear();
    mockNavigate.mockClear();
  });

  test("renders login form correctly", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
  });

  test("displays valdiation errors", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Password must be at least 6 characters long/i)
      ).toBeInTheDocument();
    });
  });

  test("successful login navigates to /applications", async () => {
    apiClient.post.mockResolvedValue({ data: { accessToken: "test-token" } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.type(screen.getByLabelText(/Password/i), "password");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("auth/login", {
        email: "test@example.com",
        password: "password",
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "accessToken",
        "test-token"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/applications");
    });
  });

  test("failed login does not navigate", async () => {
    apiClient.post.mockRejectedValue({
      response: {
        status: 400,
        data: { message: "Email or password is incorrect" },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.type(screen.getByLabelText(/Password/i), "password");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("auth/login", {
        email: "test@example.com",
        password: "password",
      });
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
    });
  });
});
