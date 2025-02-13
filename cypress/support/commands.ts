Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');

  // Esperar a que el formulario de login aparezca
  cy.get('form', { timeout: 10000 }).should('exist');

  // Buscar los inputs dentro de `app-input`
  cy.get('app-input')
    .eq(0)
    .find('input')
    .should('be.visible')
    .type(username, { delay: 100 });
  cy.get('app-input')
    .eq(1)
    .find('input')
    .should('be.visible')
    .type(password, { delay: 100 });

  // Hacer clic en el botón "Continuar"
  cy.get('app-button').contains('Continuar').should('be.visible').click();

  // Esperar a que el usuario sea redirigido a home
  cy.url().should('include', '/home');
});
