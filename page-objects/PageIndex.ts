import { Page } from "@playwright/test";
import { AmountPage } from "../page-objects/RequestLoanAmountPage";

export class PageIndex {
  private readonly page: Page;
  private readonly amountPage: AmountPage;

  constructor(page: Page) {
    this.page = page;
    this.amountPage = new AmountPage(this.page);
  }

  amount() {
    return this.amountPage;
  }
}
