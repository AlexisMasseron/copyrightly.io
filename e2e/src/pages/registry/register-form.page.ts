import { element, by, browser, ElementFinder } from 'protractor';

export class RegisterFormPage {

  private form: ElementFinder;
  private author: ElementFinder;
  private title: ElementFinder;
  private hash: ElementFinder;

  constructor() {
    this.form = element(by.id('manifest-form'));
    this.author = this.form.element(by.id('inputAuthor'));
    this.title = this.form.element(by.id('inputTitle'));
    this.hash = this.form.element(by.id('inputHash'));
  }

  async fillRegisterForm(title: string, hash: string) {
    await this.title.sendKeys(title);
    await this.hash.sendKeys(hash);
  }
}
