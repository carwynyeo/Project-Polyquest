// src/test/setup.ts
import "@testing-library/jest-dom/vitest"

if (typeof window !== "undefined") {
  // Mock window.matchMedia
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {}
      }
    }

  // Mock addEventListener for media elements
  HTMLMediaElement.prototype.addEventListener =
    HTMLMediaElement.prototype.addEventListener || function () {}
}
