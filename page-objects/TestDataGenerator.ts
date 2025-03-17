import { Page } from "@playwright/test";

export class TestData {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getRandomOption(dropdown: { options: string[] }): string {
    return dropdown.options[
      Math.floor(Math.random() * dropdown.options.length)
    ];
  }

  generateLoanRequirementsData(loanRequirementsDropdownData: any): any {
    const min = 5000;
    const max = 250000;
    const step = 1000;

    const randomAmount =
      Math.floor(Math.random() * ((max - min) / step + 1)) * step + min;

    const dropdownFields = [
      "loanPeriodDropdown",
      "annualTurnoverDropdown",
      "loanDeadlineDropdown",
      "loanGoalDropdown",
    ];

    return {
      loanAmount: String(randomAmount),
      dropdowns: dropdownFields.map((field) => ({
        field: loanRequirementsDropdownData[field].field,
        value: this.getRandomOption(loanRequirementsDropdownData[field]),
      })),
    };
  }
}
