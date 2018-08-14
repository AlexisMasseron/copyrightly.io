import { Given, When, Then } from 'cucumber';
import { RegisterFormPage } from '../pages/registry/register-form.page';

const userForm = new RegisterFormPage();

When(/^I fill the register form with title "([^"]*)" and content hash "([^"]*)"$/,
  async (title: string, hash: string) => {
  await userForm.fillRegisterForm(title, hash);
});
