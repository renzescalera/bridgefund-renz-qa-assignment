import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("Loan Request Amount page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/nl/request-loan/amount");
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
    const pageObject = new PageIndex(page);

    const initialValue = await pageObject
      .amount()
      .getAmountField()
      .inputValue();

    // Wait for the slider to be visible
    const amountSlider = page.locator('input[type="range"]');
    await amountSlider.waitFor({ state: "visible" });

    // Get slider bounding box
    const boundingBox = await amountSlider.boundingBox();
    if (!boundingBox) {
      throw new Error("Slider not found!");
    }

    // Extract slider position
    const { x, y, width, height } = boundingBox;
    const sliderY = y + height / 2; // Center of the slider

    // Start position (left edge) and move towards right
    const startX = x + 5;
    const endX = x + width - 10; // Move to the right

    // Move the mouse to the start position
    await page.mouse.move(startX, sliderY);
    await page.mouse.down(); // Hold mouse button
    await page.mouse.move(endX, sliderY, { steps: 10 }); // Drag with steps
    await page.mouse.up(); // Release mouse button

    await pageObject.amount().getAmountField().waitFor({ state: "visible" });

    // Get updated loan amount from input field
    const updatedValue = await pageObject
      .amount()
      .getAmountField()
      .inputValue();

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

    // TODO: Make dynamic data not a hard coded like this
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

    await page.waitForResponse("**/g/collect?*");

    const currentUrl = await page.url();
    expect(currentUrl).toContain("contact");
  });

  test("Should be able to go back to the previous page", async ({ page }) => {
    const pageObject = new PageIndex(page);

    // TODO: Make dynamic data not a hard coded like this
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

    await page.waitForResponse("**/g/collect?*");

    const oldUrl = page.url();

    await pageObject.amount().getPreviousButton().first().click();

    const newUrl = page.url();
    expect(newUrl).toContain("amount");
    expect(oldUrl).not.toBe(newUrl);

    await pageObject.amount().validateCompletedAmountForm(loanRequirementsData);
  });

  test("Should retain informations when page refreshes.", async ({ page }) => {
    const pageObject = new PageIndex(page);

    // TODO: Make dynamic data not a hard coded like this
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

    await page.reload();

    await page.waitForResponse("**/g/collect?*");

    await pageObject.amount().validateCompletedAmountForm(loanRequirementsData);
  });
});
