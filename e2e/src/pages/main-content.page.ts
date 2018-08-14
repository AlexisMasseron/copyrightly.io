import { element, by, browser, ExpectedConditions } from 'protractor';

export class MainContentPage {

  private mainContainer;

  constructor() {
    this.mainContainer = element(by.css('main.container'));
  }

  async clickLinkWithText(text: string) {
    await this.mainContainer.element(by.partialLinkText(text)).click();
    browser.waitForAngular();
  }

  async clickButtonWithText(text: string) {
    const button = this.mainContainer.element(by.partialButtonText(text));
    browser.wait(ExpectedConditions.elementToBeClickable(button));
    await button.click();
    browser.waitForAngular();
  }
}
