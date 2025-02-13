describe('Pruebas del Carrito de Compras', () => {
  beforeEach(() => {
    cy.login('test', '1234');
    cy.visit('/products');
  });

  it('Debe mostrar el total correcto en el carrito', () => {
    // Agregar dos productos al carrito
    cy.get('.add-to-cart-icon').eq(1).click();
    cy.get('.add-to-cart-icon').eq(6).click();

    // Ir al carrito
    cy.visit('/cart');

    // Verificar que hay dos productos en el carrito
    cy.get('.cart-item', { timeout: 10000 }).should('have.length', 2);

    // Verificar que el total de productos es correcto
    cy.get('.cart-summary')
      .invoke('text')
      .then((text) => {
        expect(text).to.include('Total de productos: 2');
      });

    // Verificar que el total del precio es correcto
    let total = 0;
    cy.get('.cart-item p').each(($el) => {
      const price = parseFloat($el.text().replace('$', ''));
      total += price;
    });

    cy.get('.cart-summary h3:nth-of-type(2)')
      .invoke('text')
      .then((text) => {
        const totalDisplayed = parseFloat(text.replace('Precio total: $', ''));
        expect(totalDisplayed).to.equal(total);
      });
  });

  it('Debe permitir eliminar un producto del carrito', () => {
    cy.get('.add-to-cart-icon').eq(6).click();
    cy.visit('/cart');

    // Verificar que el producto aparece en el carrito
    cy.get('.cart-item', { timeout: 10000 }).should('have.length', 1);

    // Eliminar el producto
    cy.get('.cart-item-actions button').first().click();

    // Verificar que el carrito está vacío
    cy.get('.cart-item').should('not.exist');
  });

  it('Debe permitir actualizar la cantidad de un producto en el carrito', () => {
    cy.get('.add-to-cart-icon').eq(0).click();
    cy.visit('/cart');

    // Esperar a que el input de cantidad esté disponible
    cy.get('.cart-item input[type="number"]', { timeout: 10000 }).should(
      'exist'
    );

    // Borrar y escribir una nueva cantidad sin encadenar la acción
    cy.get('.cart-item input[type="number"]').clear({ force: true });

    // Esperar a que Angular re-renderice y volver a obtener el input
    cy.wait(500);
    cy.get('.cart-item input[type="number"]', { timeout: 10000 })
      .should('exist')
      .as('quantityInput');

    // Escribir el nuevo valor con `type()` y sin encadenarlo con `blur()`
    cy.get('@quantityInput').type('0', { delay: 100 });

    // Esperar a que el carrito se actualice y volver a verificar el input después del re-render
    cy.wait(500);
    cy.get('.cart-item input[type="number"]').should('have.value', '0');

    // Verificar que el total de productos se actualiza correctamente
    cy.get('.cart-summary h3:nth-of-type(1)')
      .invoke('text')
      .should('include', 'Total de productos: 3');
  });
});
