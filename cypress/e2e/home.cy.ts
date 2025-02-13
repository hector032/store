describe('Página de Inicio', () => {
  it('Debe cargar correctamente el Home y mostrar el gráfico', () => {
    cy.visit('/home');

    // Verifica que el header tenga el nombre "Mi Tienda"
    cy.get('mat-toolbar').contains('Mi Tienda').should('be.visible');

    // Ahora busca el gráfico con el selector correcto
    cy.get('ngx-charts-bar-vertical', { timeout: 10000 }).should('be.visible');
  });
});
