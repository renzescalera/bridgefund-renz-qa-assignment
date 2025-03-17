import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";
import { faker } from "@faker-js/faker";

test.describe("Loan Request Contact page functional tests", () => {
  let pageObject;
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/nl/request-loan/contact");
    pageObject = new PageIndex(page);

    const companyKeyword = "Technology"; // Using a keyword to search a company dynamically
    await pageObject.contact().quickCompanySearch(companyKeyword);
  });

  test("Should be able to search for company using KVK and display correct company details", async ({
    page,
  }) => {
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

  // TODO: Still need to do some clean up
  test("Should select a listed director and first name and last name must be prefilled after selection", async ({
    page,
  }) => {
    const interceptedApiCompanyInfo = await page.waitForResponse(
      "**/company-network-service/v1/company-information?*"
    );

    const apiCompanyDetails = await interceptedApiCompanyInfo.json();

    const randomIndex = Math.floor(
      Math.random() * apiCompanyDetails.data.people.length
    );

    const randomDirector = apiCompanyDetails.data.people[randomIndex];

    const companyDirector = page.locator(".w-full gr-radio", {
      hasText: randomDirector.full_name,
    });

    await companyDirector.click();

    // Storing First name
    const firstNameValue = page
      .locator('gr-input[name="userFirstName"]')
      .locator("input")
      .and(page.getByRole("textbox", { name: "First name" }));

    // Validate the input value that is has the First name
    await expect(firstNameValue).toHaveValue(randomDirector.first_name);

    // Storing Last name
    const lastNameValue = page
      .locator('gr-input[name="userLastName"]')
      .locator("input")
      .and(page.getByRole("textbox", { name: "Last name" }));

    // Validate the input value that is has the Last name
    await expect(lastNameValue).toHaveValue(randomDirector.last_name);
  });

  const formFields = [
    { method: "getFirstNameField", value: faker.person.firstName() },
    { method: "getLastNameField", value: faker.person.lastName() },
    { method: "getEmailField", value: faker.internet.email() },
    { method: "getPhoneNumberField", value: "614109257" },
  ];

  formFields.forEach(({ method, value }) => {
    test(`Should be able to enter loaner personal details: ${method
      .replace("get", "")
      .replace("Field", "")}`, async () => {
      const field = pageObject.contact()[method]();
      await field.fill(value);
      await expect(field).toHaveValue(value);
    });
  });
});
