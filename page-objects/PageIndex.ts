import { Page } from "@playwright/test";
import { AmountPage } from "../page-objects/RequestLoanAmountPage";
import { TestData } from "../page-objects/TestDataGenerator";

export class PageIndex {
  private readonly page: Page;
  private readonly amountPage: AmountPage;
  private readonly testData: TestData;

  constructor(page: Page) {
    this.page = page;
    this.amountPage = new AmountPage(this.page);
    this.testData = new TestData(this.page);
  }

  amount() {
    return this.amountPage;
  }

  data() {
    return this.testData;
  }
}
