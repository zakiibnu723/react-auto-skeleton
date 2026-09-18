import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { AutoSkeleton } from "./AutoSkeleton";

describe("AutoSkeleton", () => {
  it("renders children when not loading", () => {
    render(
      <AutoSkeleton loading={false}>
        <button type="button">Click me</button>
      </AutoSkeleton>
    );

    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("sets up skeleton mode when loading", async () => {
    render(
      <AutoSkeleton loading>
        <div>
          <p>Text content</p>
          <img alt="cover" />
        </div>
      </AutoSkeleton>
    );

    await waitFor(() => {
      expect(document.querySelector("[data-ras-probe]")).toBeTruthy();
      expect(document.querySelector(".ras-animate-shimmer")).toBeTruthy();
    });
  });
});
