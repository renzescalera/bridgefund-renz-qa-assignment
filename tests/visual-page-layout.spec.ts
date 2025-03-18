import { test, expect } from "@playwright/test";

test.describe("Responsive Layout and Visual Regression - Amount page and Contact page", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  const pages = [
    { name: "Amount-page", url: "/en/nl/request-loan/amount" },
    { name: "Contact-page", url: "/en/nl/request-loan/contact" },
  ];

  for (const pageInfo of pages) {
    for (const viewport of viewports) {
      test(`${pageInfo.name} UI - should match snapshot on ${viewport.name}`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(pageInfo.url);
        await page.waitForLoadState("networkidle");

        // Capture and compare screenshot
        expect(await page.screenshot()).toMatchSnapshot(
          `ui-${pageInfo.name}-${viewport.name}.png`,
          {
            threshold: 1.0, // Allow slight differences - ratio ranges between 0.9 to 0.3
          }
        );
      });
    }
  }
});
