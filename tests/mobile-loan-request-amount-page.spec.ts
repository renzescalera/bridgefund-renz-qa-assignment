import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";
import loanRequirementsDropdownData from "../test-data/loan-requirements-data.json";

test.describe("Loan Request Amount page Mobile tests", () => {
  let pageObject: any;
  let loanRequirementsData: any;

  test.beforeEach(async ({ page }) => {
    pageObject = new PageIndex(page);

    await page.goto("/en/nl/request-loan/amount");

    loanRequirementsData = await pageObject
      .data()
      .generateLoanRequirementsData(loanRequirementsDropdownData);
  });

  test("Should complete amount page in mobile viewport", async () => {
    await pageObject.amount().completeAmountForm(loanRequirementsData);
    await pageObject.amount().validateCompletedAmountForm(loanRequirementsData);

    // Validate next button to be clickable
    await expect(pageObject.amount().getNextButton()).toBeEnabled();
  });
});
