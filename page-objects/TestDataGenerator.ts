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
    const dropdownFields = [
      "loanPeriodDropdown",
      "annualTurnoverDropdown",
      "loanDeadlineDropdown",
      "loanGoalDropdown",
    ];

    return {
      loanAmount: "12000",
      dropdowns: dropdownFields.map((field) => ({
        field: loanRequirementsDropdownData[field].field,
        value: this.getRandomOption(loanRequirementsDropdownData[field]),
      })),
    };
  }
}
