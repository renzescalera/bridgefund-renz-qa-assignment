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

  test("Should search for a company and display correct company details", async ({
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

    await pageObject.contact().selectCompanyDirector(randomDirector.full_name);

    // Validate first name has been prefilled
    await expect(pageObject.contact().getFirstNameField()).toHaveValue(
      randomDirector.first_name
    );

    // Validate last name has been prefilled
    await expect(pageObject.contact().getLastNameField()).toHaveValue(
      randomDirector.last_name
    );
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

      // TODO: Maybe it is good to include the (unchecked) checkboxes as well
      await expect(pageObject.contact().getNextButton()).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });

  // TODO: WIP
  test("Should be able to check email option checkbox", async ({ page }) => {
    const checkboxEmailOption = page
      .locator('gr-checkbox[name="emailOptIn"]')
      .locator('input[type="checkbox"]');

    await page.locator('gr-checkbox[name="emailOptIn"]').click();
    // await checkbox.check();

    // Verify the checkbox is checked
    await expect(checkboxEmailOption).toBeChecked();
  });

  // TODO: WIP
  test("Should be able to check terms and condition checkbox", async ({
    page,
  }) => {
    const checkboxTermsAndCond = page
      .locator('gr-checkbox[name="agreeToTermsAndConditions"]')
      .locator('input[type="checkbox"]');

    await page.locator('gr-checkbox[name="agreeToTermsAndConditions"]').click();
    // await checkbox.check();

    // Verify the checkbox is checked
    await expect(checkboxTermsAndCond).toBeChecked();
  });

  // TODO: WIP
  // TODO: Also apply here the Visual Regression Testing – Capture snapshots for UI comparison.
  // test.skip("Should adapt to page layout changes across different screen size", async ({
  //   page,
  // }) => {
  // });
});
