import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { errorsInterceptor } from './services/errors-interceptor.service';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  //{ path: '**', redirectTo: 'login' }, // Redirige a login si la ruta no existe

  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },

  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },

  //{ path: 'products', component: ProductListComponent },
  //{ path: 'product/:id', component: ProductDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), // Configuración de rutas
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useValue: errorsInterceptor,
      multi: true, // Nos permite múltiples interceptores si se añaden más en el futuro
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
