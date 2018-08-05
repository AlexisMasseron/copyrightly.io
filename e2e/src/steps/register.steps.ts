import { defineSupportCode } from 'cucumber';
import { RegisterFormPage } from '../pages/registry/register-form.page';


defineSupportCode(({Given, When, Then, Before}) => {

  const userForm = new RegisterFormPage();

  When(/^I fill the form with title "([^"]*)" and content hash "([^"]*)"$/,
    async (title, hash) => {
    await userForm.fillRegisterForm(title, hash)
  });
});
