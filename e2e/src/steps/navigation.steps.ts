import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
import { browser } from 'protractor';
import { NavigationBar } from '../pages/navbar.page';
import { MainContentPage } from '../pages/main-content.page';

const navBar = new NavigationBar();
const mainContent = new MainContentPage();

Given(/^I'm on the home page and authenticated$/, async () => {
  await browser.get('http://localhost:4200');
  expect(await navBar.getSelectedAccount()).to.not.be.empty;
});

When(/^I go to the home page$/, async () => {
  await navBar.goToHome();
});

When(/^I click menu option "([^"]*)"$/, async (option: string) => {
  await navBar.goToMenuOption(option);
});

When(/^I click submenu option "([^"]*)" in menu "([^"]*)"$/,
  async (option: string, menu: string) => {
  await navBar.goToMenuOption(menu);
  await navBar.goToMenuOption(option);
});

When(/^I click the "([^"]*)" button$/, async (text: string) => {
  await mainContent.clickButtonWithText(text);
});
