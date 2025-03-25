import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  snapshotDir: "test-data/visual-snapshots",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "https://my.bridgefund.nl",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: "mobile-loan-request-amount-page.spec.ts",
      use: {
        ...devices["iPhone 13 Pro Max"],
        // browserName: "chromium", // Commenting this out - for reference use only
      },
    },
  ],
});
