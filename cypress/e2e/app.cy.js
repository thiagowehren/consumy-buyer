class RegisterForm {
  elements = {
    emailInput: () => cy.get('#input-1'),
    passwordInput: () => cy.get('#input-3')
  }
}

describe('Login', () => {
  const registerForm = new RegisterForm();

  describe('Submitting correct login with valid inputs', () => {
    const input = {
      emailPrefix: 'seller1',
      emailDomain: 'example.com',
      password: '123456'
    };

    it('should visit the login page', () => {
      cy.visit('/login');
    });

    it('should fill in the email', () => {
      registerForm.elements.emailInput().type(input.emailPrefix, { delay: 100 });
    });

    it('should fill in the password', () => {
      registerForm.elements.passwordInput().type(input.password, { delay: 100 });
    });

    it('should submit the login form', () => {
      cy.get('form').submit();
    });

    it('should handle incorrect login and correct email domain', () => {
      registerForm.elements.emailInput().clear().type(`${input.emailPrefix}@${input.emailDomain}`, { delay: 100 });
      cy.get('form').submit();
      cy.url().should('eq', 'http://localhost:5173/');
    });
  });
});