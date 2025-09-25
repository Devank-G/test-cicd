import { render, screen, fireEvent, act } from "@testing-library/react";
import Dashboard from "../app/page";

// Mock Chart.js
jest.mock("chart.js/auto", () => {
  return jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    data: { labels: [], datasets: [{ data: [] }] },
  }));
});

// Mock sendEmail
jest.mock("../app/sendEmail", () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Component renders correctly
  it("renders all dashboard components", () => {
    render(<Dashboard />);

    expect(
      screen.getByRole("heading", { name: /infrastructure dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send email/i })
    ).toBeInTheDocument();
    expect(screen.getByText("CPU Usage")).toBeInTheDocument();
    expect(screen.getByText("Memory Usage")).toBeInTheDocument();
    expect(screen.getByText("Network Traffic (Mbps)")).toBeInTheDocument();
  });

  // Test 2: WebSocket status changes
  it("shows WebSocket status changing from Connecting to Connected", () => {
    jest.useFakeTimers();
    render(<Dashboard />);

    expect(screen.getByText("Connecting...")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText("Connected")).toBeInTheDocument();
    jest.useRealTimers();
  });

  // Test 3: Send email functionality
  it("calls sendEmail when button is clicked", async () => {
    const { sendEmail } = require("../app/sendEmail");
    render(<Dashboard />);

    const button = screen.getByRole("button", { name: /send email/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(sendEmail).toHaveBeenCalledWith({
      to: "recipient@example.com",
      subject: "Dashboard Alert",
      htmlContent: "<p>This is a test email from the dashboard.</p>",
    });
  });

  // Test 4: Status indicator color changes
  it("displays correct status indicator colors", () => {
    jest.useFakeTimers();
    render(<Dashboard />);

    // Initial red indicator for "Connecting..."
    const indicator = document.querySelector(".w-3.h-3.rounded-full");
    expect(indicator).toHaveClass("bg-red-500");

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Green indicator for "Connected"
    expect(indicator).toHaveClass("bg-green-500");
    jest.useRealTimers();
  });

  // Test 5: Chart canvas elements are present
  it("renders chart canvas elements for all metrics", () => {
    render(<Dashboard />);

    const canvasElements = document.querySelectorAll("canvas");
    expect(canvasElements).toHaveLength(3); // CPU, Memory, Network charts
  });
});
