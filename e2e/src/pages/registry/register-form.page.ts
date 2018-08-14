import { element, by, browser, ElementFinder, ExpectedConditions } from 'protractor';

const path = require('path');

export class RegisterFormPage {

  private form; author; title; hash; file; button: ElementFinder;

  constructor() {
    this.form = element(by.id('manifest-form'));
    this.author = this.form.element(by.id('inputAuthor'));
    this.title = this.form.element(by.id('inputTitle'));
    this.hash = this.form.element(by.id('inputHash'));
    this.file = this.form.element(by.id('inputFile'));
    this.button = this.form.element(by.id('manifest'));
  }

  async fillRegisterForm(title: string, relativePath: string) {
    await this.title.sendKeys(title);

    const absolutePath = path.resolve(__dirname, relativePath);
    await this.file.sendKeys(absolutePath);
    await browser.waitForAngular();
  }
}
