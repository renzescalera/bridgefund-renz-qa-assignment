import { Page, expect } from "@playwright/test";

export class ContactPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async quickCompanySearch(companySearchParam: string) {
    const searchCompany = this.page.getByPlaceholder("Type here to search");
    await searchCompany.fill(companySearchParam);

    const searchedCompany = await this.page.waitForResponse(
      `**/company-network-service/v1/companies?searchTerm=${companySearchParam}&countryCode=nl`
    );

    const searchCompanyResponse = await searchedCompany.json();
    const companyName = searchCompanyResponse.data[0].name;

    const company = this.page.locator(".mt-5 li span", {
      hasText: companyName,
    });

    await company.first().click();
  }

  async selectCompanyDirector(directorName: string) {
    const companyDirector = this.page.locator(".w-full gr-radio", {
      hasText: directorName,
    });

    await companyDirector.click();
  }

  getFirstNameField() {
    return this.page
      .locator('gr-input[name="userFirstName"]')
      .locator("input")
      .and(this.page.getByRole("textbox", { name: "First name" }));
  }

  getLastNameField() {
    return this.page
      .locator('gr-input[name="userLastName"]')
      .locator("input")
      .and(this.page.getByRole("textbox", { name: "Last name" }));
  }

  getEmailField() {
    return this.page
      .locator('gr-input[name="userEmail"]')
      .locator("input")
      .and(this.page.getByRole("textbox", { name: "Email" }));
  }

  getPhoneNumberField() {
    return this.page.getByPlaceholder("Phone number");
  }

  getEmailCheckbox() {
    return this.page
      .locator('gr-checkbox[name="emailOptIn"]')
      .locator('input[type="checkbox"]');
  }

  getTermsAndCondCheckbox() {
    return this.page
      .locator('gr-checkbox[name="agreeToTermsAndConditions"]')
      .locator('input[type="checkbox"]');
  }

  getNextButton() {
    return this.page.locator(".button-primary");
  }
}
