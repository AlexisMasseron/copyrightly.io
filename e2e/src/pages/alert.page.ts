import { element, by, ElementFinder, browser, ExpectedConditions } from 'protractor';

export class Alert {

  private alerts: ElementFinder;

  constructor() {
    this.alerts = element(by.id('alerts'));
  }

  async getLastAlertMessage(): Promise<string> {
    browser.wait(ExpectedConditions.presenceOf(this.alerts));
    return await this.alerts.all(by.css('div.alert')).first().getText();
  }

  async closeLastAlert() {
    await this.alerts.all(by.css('div.alert')).first().element(by.css('button.close')).click();
  }
}
