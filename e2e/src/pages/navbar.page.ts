import { element, by, browser, ExpectedConditions } from 'protractor';

export class NavigationBar {
  private navbar;
  private accounts;
  private refreshButton;
  private home;

  constructor() {
    this.accounts = element(by.id('accounts'));
    this.refreshButton = element(by.id('refresh-accounts'));
    this.home = element(by.className('navbar-brand'));
  }

  async goToHome() {
    await this.home.click();
  }

  async goToMenuOption(option: string) {
    await element(by.partialLinkText(option)).click();
  }

  async refreshAccounts() {
    browser.wait(ExpectedConditions.presenceOf(this.refreshButton));
    await this.refreshButton.click();
    browser.waitForAngular();
  }

  async getSelectedAccount(): Promise<string> {
    return await this.accounts.getText();
  }

  async setSelectedAccount(account: string) {
    await this.accounts.element(by.css('option[value="' + account + '"]')).click();
  }
}
