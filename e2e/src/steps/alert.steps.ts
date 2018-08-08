import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
import { Alert } from '../pages/alert.page';

const alert = new Alert();

Then(/^I see alert with text "([^"]*)" and close it$/, async (fragment: string) => {
  expect(await alert.getLastAlertMessage()).to.contain(fragment);
  await alert.closeLastAlert();
});
