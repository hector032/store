describe('Página de Productos', () => {
  beforeEach(() => {
    cy.visit('/products');

    // Espera a que desaparezca el loading antes de validar cualquier otra cosa
    cy.get('.loading-spinner').should('not.exist');
  });

  it('Debe mostrar la lista de productos', () => {
    cy.get('.product-list').should('be.visible');
  });

  it('Debe mostrar al menos un producto', () => {
    cy.get('.product-card').should('have.length.greaterThan', 0);
  });

  it('Debe mostrar el título del producto', () => {
    cy.get('.product-card', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .should('be.visible');

    // Esperar a que los títulos sean visibles
    cy.get('.product-card mat-card-title', { timeout: 10000 }).should(
      'be.visible'
    );
  });

  it('Debe mostrar la categoría del producto', () => {
    cy.get('.product-card').should('have.length.greaterThan', 0); // Asegurar que hay productos
    cy.get('.product-card .category-text').should('be.visible');
  });

  it('Debe mostrar la imagen del producto', () => {
    cy.get('.product-card .product-image').should('be.visible');
  });

  it('Debe mostrar el precio del producto', () => {
    cy.get('.product-card .price').should('be.visible');
  });

  it('Debe abrir la página de detalles al hacer clic en "Ver detalles"', () => {
    cy.get('.btn-details').first().click();
    cy.url().should('include', '/product/');
  });

  it('Debe impedir agregar un producto al carrito sin estar autenticado', () => {
    cy.visit('/products');

    // Esperar a que al menos un producto cargue en la página
    cy.get('.product-card', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .should('be.visible');

    // Esperar a que el icono de agregar al carrito esté presente en el DOM y hacer clic
    cy.get('.add-to-cart-icon', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .first()
      .click();

    // Verificar que redirige a login
    cy.url().should('include', '/login');
  });

  it('Debe permitir agregar un producto al carrito si el usuario está autenticado', () => {
    // Iniciar sesión con el comando login corregido
    cy.login('test', '1234');

    // Ir a la página de productos después del login
    cy.visit('/products');

    // Esperar a que los productos se carguen completamente
    cy.get('.product-card', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .should('be.visible');

    // Esperar a que el botón de agregar al carrito esté presente
    cy.get('.add-to-cart-icon', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .first()
      .click();

    // Ir al carrito
    cy.visit('/cart');

    // Verificar que el producto se añadió correctamente al carrito
    cy.get('.cart-item', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0
    );
  });
});
