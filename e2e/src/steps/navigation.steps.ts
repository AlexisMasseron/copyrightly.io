import { binding, given, when, then } from 'cucumber-tsflow';
import { expect } from 'chai';
import { browser } from 'protractor';
import { NavigationBar } from '../pages/navbar.page';
import { MainContentPage } from '../pages/main-content.page';

@binding()
export class NavigationSteps {
  private navBar = new NavigationBar();
  private mainContent = new MainContentPage();

  @given(/^I'm on the home page and authenticated$/)
  async iMInHomePageAuthenticated() {
    await browser.get('http://localhost:4200');
    expect(await this.navBar.getSelectedAccount()).to.not.be.empty;
  }


  @when(/^I go to the home page$/)
  async iGoToHomePage() {
    await this.navBar.goToHome();
  }

  @when(/^I click menu option "([^"]*)"$/)
  async iClickMenuOption (option: string) {
    await this.navBar.goToMenuOption(option);
  }

  @when(/^I click submenu option "([^"]*)" in menu "([^"]*)"$/)
  async iClickSubMenuOption (option: string, menu: string) {
    await this.navBar.goToMenuOption(menu);
    await this.navBar.goToMenuOption(option);
  }

  @when(/^I click the "([^"]*)" button$/)
  async iClickButton (text: string) {
    await this.mainContent.clickButtonWithText(text);
  }
}
