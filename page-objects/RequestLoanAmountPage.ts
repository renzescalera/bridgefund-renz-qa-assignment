import { Page, Locator, expect } from "@playwright/test";

export class AmountPage {
  private readonly page: Page;
  //   private readonly amountField: Locator;
  //   private readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // this.amountField = page.locator('[inputmode="numeric"]');
  }

  getAmountField() {
    return this.page.locator('[inputmode="numeric"]');
  }

  getLoanTypeDropdown() {
    return this.page
      .locator('gr-select[name="loanPeriods"]')
      .locator("gr-dropdown#dropdown-1");
  }

  getNextButton() {
    return this.page.locator("gr-button.button-primary");
  }

  async selectDropdownOption(dropdownType: string, selectedOption: string) {
    let dropdownIndex: number;

    // TODO: Use object instead - need to optimize
    switch (dropdownType) {
      case "loanPeriods":
        dropdownIndex = 1;
        break;
      case "companyRevenue":
        dropdownIndex = 2;
        break;
      case "loanDeadline":
        dropdownIndex = 3;
        break;
      case "loanGoal":
        dropdownIndex = 4;
        break;
      default:
        dropdownIndex = 0; // Default value if no match
    }

    const dropdown = this.page
      .locator(`gr-select[name="${dropdownType}"]`)
      .locator(`gr-dropdown#dropdown-${dropdownIndex}`);

    await dropdown.click();

    const dropdownOption = this.page.locator("gr-menu-item", {
      hasText: selectedOption,
    });

    await dropdownOption.click();
  }

  async validateDropdownSelectedOption(
    dropdownType: string,
    expectedOption: string
  ) {
    let dropdownIndex: number;

    // TODO: Use object instead - need to optimize
    // Similar from dropdown option, might be useful to separate the repated codes
    switch (dropdownType) {
      case "loanPeriods":
        dropdownIndex = 1;
        break;
      case "companyRevenue":
        dropdownIndex = 2;
        break;
      case "loanDeadline":
        dropdownIndex = 3;
        break;
      case "loanGoal":
        dropdownIndex = 4;
        break;
      default:
        dropdownIndex = 0; // Default value if no match
    }

    const dropdownLocator = this.page
      .locator(`gr-select[name="${dropdownType}"]`)
      .locator(`gr-dropdown#dropdown-${dropdownIndex}`);

    const dropdownText = (await dropdownLocator.textContent()) || "";

    const expectedLoanType = dropdownText
      .replace(/\s*Chevron Down\s*/, "")
      .trim();

    expect(expectedLoanType).toBe(expectedOption);
  }

  async completeAmountForm(amountFormDataObject) {
    const { loanAmount, dropdowns } = amountFormDataObject;

    await this.getAmountField().fill(loanAmount);

    for (const loanData of dropdowns) {
      await this.selectDropdownOption(loanData.field, loanData.value);
    }
  }

  async validateCompletedAmountForm(expectedAmountFormDataObject) {
    const { loanAmount, dropdowns } = expectedAmountFormDataObject;

    // const inputValue = await this.getAmountField().inputValue();
    // expect(inputValue).toBe(loanAmount); // TODO: Fix the number separator - consider the (,) for EN and (.) for NL

    for (const expectedLoanData of dropdowns) {
      await this.validateDropdownSelectedOption(
        expectedLoanData.field,
        expectedLoanData.value
      );
    }
  }
}
