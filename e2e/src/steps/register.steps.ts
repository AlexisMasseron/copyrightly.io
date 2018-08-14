import { Given, When, Then } from 'cucumber';
import { RegisterFormPage } from '../pages/registry/register-form.page';

const userForm = new RegisterFormPage();

When(/^I fill the register form with title "([^"]*)" and content file "([^"]*)"$/,
  async (title: string, path: string) => {
  await userForm.fillRegisterForm(title, path);
});
