import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";
import loanRequirementsDropdownData from "../test-data/loan-requirements-data.json";

test.describe("Loan Request Contact page functional tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/nl/request-loan/contact");
  });

  test("Should be able to search for company using KVK and display correct company details", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const companyKvk = "34095964";

    await pageObject.contact().quickCompanySearch(companyKvk);

    const interceptedApi = await page.waitForResponse(
      "**/company-network-service/v1/company-information?*"
    );

    const apiCompanyDetails = await interceptedApi.json();
    const uiCompanyDetails = await page.locator(".mt-5").first().textContent();

    const uiCompanyName = await page
      .locator(".mt-4 span")
      .first()
      .textContent();

    // Validate company name
    expect(uiCompanyName.trim()).toBe(apiCompanyDetails.data.name);

    // Validate company kvk
    expect(uiCompanyDetails).toContain(apiCompanyDetails.data.coc_number);

    // Validate company address
    expect(uiCompanyDetails).toContain(
      apiCompanyDetails.data.address.address_line
    );
    expect(uiCompanyDetails).toContain(
      apiCompanyDetails.data.address.postal_code
    );
    expect(uiCompanyDetails).toContain(apiCompanyDetails.data.address.city);
  });

  test("Should select Jeroen as listed directors and first name and last name must be prefilled upon selection", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const bridgefundCompanyKvk = "70304580";

    await pageObject.contact().quickCompanySearch(bridgefundCompanyKvk);

    const companyDirector = page.locator(".w-full gr-radio", {
      hasText: "Jeroen",
    });

    await companyDirector.click();

    // Validating First name
    const firstNameValue = page
      .locator('gr-input[name="userFirstName"]')
      .locator("input")
      .and(page.getByRole("textbox", { name: "First name" }));

    // Validate the input value
    await expect(firstNameValue).toHaveValue("Jeroen");

    // Validating Last name
    const lastNameValue = page
      .locator('gr-input[name="userLastName"]')
      .locator("input")
      .and(page.getByRole("textbox", { name: "Last name" }));

    // Validate the input value
    await expect(lastNameValue).toHaveValue("Groeneweg");

    // For input or entering first name
    // const shadowRoot = await page
    //   .locator('gr-input[name="userFirstName"]')
    //   .evaluateHandle((el) => el.shadowRoot);
    // const firstNameInput = await shadowRoot.$("input#userFirstName");
    // await firstNameInput.fill("John");
  });
});
