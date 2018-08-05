import { binding, given, when, then } from 'cucumber-tsflow';
import { expect } from 'chai';
import { Alert } from '../pages/alert.page';

@binding()
export class AlertSteps {
  private alert = new Alert();

  @then(/^I see alert with text "([^"]*)" and close it$/)
  async iSeeAlertWithText(fragment: string) {
    expect(await this.alert.getLastAlertMessage()).to.contain(fragment);
    await this.alert.closeLastAlert();
  }
}
