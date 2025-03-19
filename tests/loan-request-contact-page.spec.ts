import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";
import { faker } from "@faker-js/faker";

test.describe("Loan Request Contact page functional tests", () => {
  let pageObject: any;
  let interceptedApiCompanyInfo: any;

  test.beforeEach(async ({ page }) => {
    await page.goto("/en/nl/request-loan/contact");
    pageObject = new PageIndex(page);

    // Using a keyword to search a company dynamically
    const keywordArr = [
      "bank",
      "technology",
      "company",
      "finance",
      "consulting",
    ];

    const randomIndex = Math.floor(keywordArr.length * Math.random());
    const companyKeyword = keywordArr[randomIndex];

    await pageObject.contact().quickCompanySearch(companyKeyword);

    interceptedApiCompanyInfo = await page.waitForResponse(
      "**/company-network-service/v1/company-information?*"
    );
  });

  test("Should search for a company and display correct company details", async ({
    page,
  }) => {
    const apiCompanyDetails = await interceptedApiCompanyInfo.json();
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

  test("Should select a listed director and first name and last name must be prefilled after selection", async () => {
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

  const fakeFirstName = faker.person.firstName();
  const fakeLastName = faker.person.lastName();
  const fakeEmail = `${fakeFirstName}.${fakeLastName}@gmail.com`;

  const contactDetailsFields = [
    { method: "getFirstNameField", value: fakeFirstName },
    { method: "getLastNameField", value: fakeLastName },
    { method: "getEmailField", value: fakeEmail },
    { method: "getPhoneNumberField", value: "614109257" },
  ];

  contactDetailsFields.forEach(({ method, value }) => {
    test(`Should be able to enter loaner personal details: ${method
      .replace("get", "")
      .replace("Field", "")}`, async () => {
      const field = pageObject.contact()[method]();

      await field.fill(value);

      await expect(field).toHaveValue(value);

      // Validating that Next button is disabled as the form is not completed`
      await expect(pageObject.contact().getNextButton()).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });

  const formCheckboxes = [
    { method: "getEmailCheckbox", label: "Email option" },
    { method: "getTermsAndCondCheckbox", label: "Terms and Condition" },
  ];

  formCheckboxes.forEach(({ method, label }) => {
    test(`Should be able to check ${label} checkbox`, async () => {
      const checkbox = pageObject.contact()[method]();

      await checkbox.check({ force: true }); // Using force to ensure interaction

      await expect(checkbox).toBeChecked();
    });
  });

  test("Should Next button is enabled when form is completed", async () => {
    for (const { method, value } of contactDetailsFields) {
      const field = pageObject.contact()[method]();

      await field.fill(value);
    }

    for (const { method } of formCheckboxes) {
      const checkbox = pageObject.contact()[method]();

      await checkbox.check({ force: true }); // Using force to ensure interaction
    }

    await expect(pageObject.contact().getNextButton()).toBeEnabled();
  });

  test("Should be able to go back to the previous page", async ({ page }) => {
    const oldUrl = page.url();

    await pageObject.amount().getPreviousButton().first().click();

    const newUrl = page.url();
    expect(newUrl).toContain("amount");
    expect(oldUrl).not.toBe(newUrl);
  });
});
