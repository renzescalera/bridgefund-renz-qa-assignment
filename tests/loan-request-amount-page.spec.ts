import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";
import loanRequirementsDropdownData from "../test-data/loan-requirements-data.json";

test.describe("Loan Request Amount page functional tests", () => {
  let pageObject: any;
  let loanRequirementsData: any;

  test.beforeEach(async ({ page }) => {
    pageObject = new PageIndex(page);

    await page.goto("/en/nl/request-loan/amount");

    loanRequirementsData = await pageObject
      .data()
      .generateLoanRequirementsData(loanRequirementsDropdownData);
  });

  test("Should enter a loan amount using the input field", async ({ page }) => {
    const generatedLoanAmount = pageObject
      .data()
      .generateLoanRequirementsData(loanRequirementsDropdownData);

    const formattedAmount = await pageObject
      .amount()
      .loanAmountFormatter(generatedLoanAmount.loanAmount);

    await pageObject.amount().getAmountField().fill(formattedAmount);
    await page.locator("body").click();

    const inputValue = await pageObject.amount().getAmountField().inputValue();
    expect(inputValue).toBe(formattedAmount);

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should enter a loan amount using the slider", async () => {
    const initialValue = await pageObject
      .amount()
      .getAmountField()
      .inputValue();

    await pageObject.amount().moveSliderToMax();

    const updatedValue = await pageObject
      .amount()
      .getAmountField()
      .inputValue();

    expect(initialValue).not.toBe(updatedValue);
  });

  test("Should select a loan type from dropdown", async () => {
    const randomIndex = Math.floor(
      loanRequirementsDropdownData.loanPeriodDropdown.options.length *
        Math.random()
    );
    const selectedOption =
      loanRequirementsDropdownData.loanPeriodDropdown.options[randomIndex];

    await pageObject
      .amount()
      .selectDropdownOption(
        loanRequirementsDropdownData.loanPeriodDropdown.field,
        selectedOption
      );

    await pageObject
      .amount()
      .validateDropdownSelectedOption(
        loanRequirementsDropdownData.loanPeriodDropdown.field,
        selectedOption
      );

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should select an annual turnover from dropdown", async () => {
    const randomIndex = Math.floor(
      loanRequirementsDropdownData.annualTurnoverDropdown.options.length *
        Math.random()
    );
    const selectedOption =
      loanRequirementsDropdownData.annualTurnoverDropdown.options[randomIndex];

    await pageObject
      .amount()
      .selectDropdownOption(
        loanRequirementsDropdownData.annualTurnoverDropdown.field,
        selectedOption
      );

    await pageObject
      .amount()
      .validateDropdownSelectedOption(
        loanRequirementsDropdownData.annualTurnoverDropdown.field,
        selectedOption
      );

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should select when loan is needed from dropdown", async () => {
    const randomIndex = Math.floor(
      loanRequirementsDropdownData.loanDeadlineDropdown.options.length *
        Math.random()
    );
    const selectedOption =
      loanRequirementsDropdownData.loanDeadlineDropdown.options[randomIndex];

    await pageObject
      .amount()
      .selectDropdownOption(
        loanRequirementsDropdownData.loanDeadlineDropdown.field,
        selectedOption
      );

    await pageObject
      .amount()
      .validateDropdownSelectedOption(
        loanRequirementsDropdownData.loanDeadlineDropdown.field,
        selectedOption
      );

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should select what plan for loan from dropdown", async () => {
    const randomIndex = Math.floor(
      loanRequirementsDropdownData.loanGoalDropdown.options.length *
        Math.random()
    );
    const selectedOption =
      loanRequirementsDropdownData.loanGoalDropdown.options[randomIndex];

    await pageObject
      .amount()
      .selectDropdownOption(
        loanRequirementsDropdownData.loanGoalDropdown.field,
        selectedOption
      );

    await pageObject
      .amount()
      .validateDropdownSelectedOption(
        loanRequirementsDropdownData.loanGoalDropdown.field,
        selectedOption
      );

    await expect(pageObject.amount().getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  test("Should navigate to the next page after filling in the required information", async ({
    page,
  }) => {
    await pageObject.amount().completeAmountForm(loanRequirementsData);
    await pageObject.amount().validateCompletedAmountForm(loanRequirementsData);

    // Validate next button to be clickable
    await expect(pageObject.amount().getNextButton()).toBeEnabled();

    await pageObject.amount().getNextButton().click();

    await page.waitForResponse("**/g/collect?*");

    const currentUrl = await page.url();

    // Validate that it landed in contact page
    expect(currentUrl).toContain("contact");
  });

  test("Should be able to go back to the previous page", async ({ page }) => {
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
    await pageObject.amount().completeAmountForm(loanRequirementsData);

    await page.reload();
    await page.waitForResponse("**/g/collect?*");

    // Validate loan details are retained after page reload
    await pageObject.amount().validateCompletedAmountForm(loanRequirementsData);
  });

  test("Should be able to view loan details in contact page", async ({
    page,
  }) => {
    await pageObject.amount().completeAmountForm(loanRequirementsData);
    await pageObject.amount().getNextButton().click();

    await page.waitForResponse("**/g/collect?*");

    const amountLoan = await page.locator(".grid .font-bold").textContent();
    const actualLoanAmount = amountLoan.replace(/[^\d,]/g, "").trim();

    const formattedAmount = await pageObject
      .amount()
      .loanAmountFormatter(loanRequirementsData.loanAmount);
    const expectedLoanAmount = await formattedAmount.trim();

    // Validate Loan Amount in contact page
    expect(actualLoanAmount).toBe(expectedLoanAmount);

    const expectedLoanGoal = loanRequirementsData.dropdowns[3].value;
    const loanGoal = await page
      .locator(".grid .col-span-1:nth-child(2)")
      .last()
      .textContent();
    const actualLoanGoal = loanGoal.trim();

    // Validate Loan Goal in contact page
    expect(expectedLoanGoal).toBe(actualLoanGoal);
  });
});
