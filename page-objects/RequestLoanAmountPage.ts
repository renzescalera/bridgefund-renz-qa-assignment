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

  private getDropdownIndex(dropdownType: string): number {
    const dropdownMap: Record<string, number> = {
      loanPeriods: 1,
      companyRevenue: 2,
      loanDeadline: 3,
      loanGoal: 4,
    };

    return dropdownMap[dropdownType] ?? 0;
  }

  async selectDropdownOption(dropdownType: string, selectedOption: string) {
    const dropdownIndex = this.getDropdownIndex(dropdownType);

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
    const dropdownIndex = this.getDropdownIndex(dropdownType);

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

    const isEnUsedAsLanguage = this.page.url().includes("/en/");
    const formattedAmount = new Intl.NumberFormat(
      isEnUsedAsLanguage ? "en-US" : "nl-NL"
    ).format(loanAmount);

    const inputValue = await this.getAmountField().inputValue();
    expect(inputValue).toBe(formattedAmount);

    for (const loanData of dropdowns) {
      const dropdownOption = await this.page
        .locator(`gr-select[name="${loanData.field}"]`)
        .evaluate((el) =>
          el.shadowRoot?.querySelector("div.select-label")?.textContent?.trim()
        );

      expect(dropdownOption).toBe(loanData.value);
    }
  }
}
