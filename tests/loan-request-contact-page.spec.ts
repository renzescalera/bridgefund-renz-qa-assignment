import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("Loan Request Contact page functional tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/nl/request-loan/contact");
  });

  test("Should be able to search for company using KVK and display correct company details", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const companyKeyword = "Technology"; // Using a keyword to search a company dynamically

    await pageObject.contact().quickCompanySearch(companyKeyword);

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
    const pageObject = new PageIndex(page);

    const bridgefundCompanyKvk = "70304580";

    await pageObject.contact().quickCompanySearch(bridgefundCompanyKvk);

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

  // TODO: This test still need to be optimized
  test("Should be able to enter loaner personal details: firstName, lastName, email, phoneNumber", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const companyKeyword = "34095964";

    await pageObject.contact().quickCompanySearch(companyKeyword);

    // For input or entering first name
    const shadowRootFirstName = await page
      .locator('gr-input[name="userFirstName"]')
      .evaluateHandle((el) => el.shadowRoot);
    const firstNameInput = await shadowRootFirstName.$("input#userFirstName");

    await firstNameInput.fill("John");

    // For input or entering last name
    const shadowRootLastName = await page
      .locator('gr-input[name="userLastName"]')
      .evaluateHandle((el) => el.shadowRoot);
    const lastNameInput = await shadowRootLastName.$("input#userLastName");

    await lastNameInput.fill("Wick");

    // For input or entering email
    const shadowRootEmail = await page
      .locator('gr-input[name="userEmail"]')
      .evaluateHandle((el) => el.shadowRoot);
    const emailInput = await shadowRootEmail.$("input#userEmail");

    await emailInput.fill("johnwick@gmail.com");

    // For input or entering phone number
    await page.getByPlaceholder("Phone number").fill("612198201");

    // clicking on body to remove type in
    await page.locator("body").click();

    // Storing First name
    const firstNameValue = page
      .locator('gr-input[name="userFirstName"]')
      .locator("input")
      .and(page.getByRole("textbox", { name: "First name" }));

    // Validate the input value that is has the First name
    await expect(firstNameValue).toHaveValue("John");

    // Storing Last name
    const lastNameValue = page
      .locator('gr-input[name="userLastName"]')
      .locator("input")
      .and(page.getByRole("textbox", { name: "Last name" }));

    // Validate the input value that is has the Last name
    await expect(lastNameValue).toHaveValue("Wick");

    // Storing email
    const emailValue = page
      .locator('gr-input[name="userEmail"]')
      .locator("input")
      .and(page.getByRole("textbox", { name: "Email" }));

    // Validate the input value that is has the Last name
    await expect(emailValue).toHaveValue("johnwick@gmail.com");

    // Storing phone number
    const phoneNumberValue = page.getByPlaceholder("Phone number");

    // Validate the input value that is has the Last name
    await expect(phoneNumberValue).toHaveValue("612198201");
  });
});
