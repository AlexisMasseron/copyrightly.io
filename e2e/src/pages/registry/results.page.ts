import { element, by, browser, ElementArrayFinder, ExpectedConditions } from 'protractor';

export class ResultsPage {

  private results: ElementArrayFinder;

  constructor() {
    this.results = element.all(by.css('.card'));
  }

  async getResultAttributeValue(attribute: string): Promise<string> {
    browser.waitForAngular();
    browser.wait(ExpectedConditions.presenceOf(this.results.first()));
    if (attribute === 'Title') {
      return await this.results.all(by.css('.card-title')).getText();
    } else {
      return await this.results
        .all(by.cssContainingText('.card-subtitle', attribute))
        .all(by.xpath('following-sibling::p')).getText();
    }
  }

  async getResultsCount(): Promise<number> {
    browser.waitForAngular();
    browser.wait(ExpectedConditions.presenceOf(this.results.first()));
    return await this.results.count();
  }
}
