import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("App routing", () => {
  it("renders the index route", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /we are educated\./i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("img", { name: /dimagi naxal party emblem/i }).length,
    ).toBeGreaterThan(0);
  });

  it("renders the catch-all route", () => {
    window.history.replaceState(null, "", "/missing");
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<App />);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });
});
