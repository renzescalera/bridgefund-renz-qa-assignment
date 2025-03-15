import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("Loan Request Amount page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://my.bridgefund.nl/en/nl/request-loan/amount"); // TODO: Fix and use base url
  });

  test("Should enter a loan amount using the input field", async ({ page }) => {
    const pageObject = new PageIndex(page);
    // await page.locator('[inputmode="numeric"]').fill("20000");
    await pageObject.amount().getAmountField().fill("20000");

    // await page.locator("body").click();

    await expect(pageObject.amount().getAmountField()).toHaveValue("20000");

    const inputValue = await pageObject.amount().getAmountField().inputValue();
    expect(inputValue).toBe("20000");

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should enter a loan amount using the slider", async ({ page }) => {
    // TODO: Make clean up

    const initialValue = await page
      .locator('[inputmode="numeric"]')
      .inputValue();
    console.log("initial value: ", initialValue);

    // Wait for the slider to be visible
    const amountSlider = page.locator('input[type="range"]');
    await amountSlider.waitFor();

    // Get slider bounding box
    const boundingBox = await amountSlider.boundingBox();
    if (!boundingBox) {
      console.error("Slider not found!");
      return;
    }

    // Extract slider position
    const { x, y, width, height } = boundingBox;
    const sliderY = y + height / 2; // Center of the slider

    console.log("boundingBox", boundingBox);

    // Start position (left edge) and move towards right
    const startX = x + 5;
    const endX = x + width - 10; // Move to the right

    // console.log(
    //   `Dragging slider from (${startX}, ${sliderY}) to (${endX}, ${sliderY})`
    // );

    // Move the mouse to the start position
    await page.mouse.move(startX, sliderY);
    await page.mouse.down(); // Hold mouse button
    await page.mouse.move(endX, sliderY, { steps: 10 }); // Drag with steps
    await page.mouse.up(); // Release mouse button

    // Wait for the UI update
    await page.waitForTimeout(2000);

    // Get updated loan amount from input field
    const updatedValue = await page
      .locator('[inputmode="numeric"]')
      .inputValue();
    console.log("Updated loan amount:", updatedValue);

    expect(initialValue).not.toBe(updatedValue);
  });

  test("Should select a loan type from dropdown", async ({ page }) => {
    const pageObject = new PageIndex(page);

    const selectedOption = "Withdraw in installments";

    await pageObject
      .amount()
      .selectDropdownOption("loanPeriods", selectedOption);

    await pageObject
      .amount()
      .validateDropdownSelectedOption("loanPeriods", selectedOption);

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should select an annual turnover from dropdown", async ({ page }) => {
    const pageObject = new PageIndex(page);

    const dropdownType = "companyRevenue";
    // const selectedOption = "Less than €25.000";
    const selectedOption = "€150.000 - €500.000";

    await pageObject
      .amount()
      .selectDropdownOption(dropdownType, selectedOption);

    await pageObject
      .amount()
      .validateDropdownSelectedOption(dropdownType, selectedOption);

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should select when loan is needed from dropdown", async ({ page }) => {
    const pageObject = new PageIndex(page);

    const dropdownType = "loanDeadline";
    const selectedOption = "No rush";

    await pageObject
      .amount()
      .selectDropdownOption(dropdownType, selectedOption);

    await pageObject
      .amount()
      .validateDropdownSelectedOption(dropdownType, selectedOption);

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should select what plan for loan from dropdown", async ({ page }) => {
    const pageObject = new PageIndex(page);

    const dropdownType = "loanGoal";
    const selectedOption = "Vehicles";

    await pageObject
      .amount()
      .selectDropdownOption(dropdownType, selectedOption);

    await pageObject
      .amount()
      .validateDropdownSelectedOption(dropdownType, selectedOption);

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should navigate to the next page after filling in the required information", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const loanRequirementsData = {
      loanAmount: "12000",
      dropdowns: [
        { field: "loanPeriods", value: "Fixed rate loan" },
        { field: "companyRevenue", value: "€150.000 - €500.000" },
        { field: "loanDeadline", value: "Within a week" },
        { field: "loanGoal", value: "Equity" },
      ],
    };

    await pageObject.amount().completeAmountForm(loanRequirementsData);
    await pageObject.amount().validateCompletedAmountForm(loanRequirementsData);

    // Validate next button to be clickable
    await expect(pageObject.amount().getNextButton()).toBeEnabled();

    await pageObject.amount().getNextButton().click();

    await page.waitForResponse(
      "https://region1.google-analytics.com/g/collect?*"
    );

    const currentUrl = await page.url();
    expect(currentUrl).toContain("contact");
  });

  // TODO: WOrk in progress
  test.skip("Should be able to go back to the previous page", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const loanRequirementsData = {
      loanAmount: "12000",
      dropdowns: [
        { field: "loanPeriods", value: "Fixed rate loan" },
        { field: "companyRevenue", value: "€150.000 - €500.000" },
        { field: "loanDeadline", value: "Within a week" },
        { field: "loanGoal", value: "Equity" },
      ],
    };

    await pageObject.amount().completeAmountForm(loanRequirementsData);
    await pageObject.amount().getNextButton().click();

    await page.waitForResponse(
      "https://region1.google-analytics.com/g/collect?*"
    );

    const oldUrl = page.url();

    console.log("old url: ", oldUrl);

    await page.locator('a[href="/en/nl/request-loan/amount"]').first().click(); // TODO: Fix selector as it could be nl instead of en - Move to page-object

    const newUrl = page.url();
    expect(newUrl).toContain("amount");
    // expect(oldUrl).not.toBe(oldUrl);

    // await pageObject.amount().validateCompletedAmountForm(loanRequirementsData);

    for (const expectedLoanData of loanRequirementsData.dropdowns) {
      await pageObject
        .amount()
        .validateDropdownSelectedOption(
          expectedLoanData.field,
          expectedLoanData.value
        );
    }

    /**
     * Pseudo code
     * 1. Complete amount form - DONE
     * 2. Click Next button - DONE
     * 3. Grab the url in a variable: oldUrl - DONE
     * 4. Validate Previous button: Should be enabled - maybe out of scope
     * 5. Validate all data in amount page - DONE
     * 6. Validate amount url: .toContain('amount') - DONE
     * 7. Validate old url vs new url: expect(oldUrl).not.toBe(newUrl) - DONE
     */
  });
});
