import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { environment } from './environments/environment';
import { errorsInterceptor } from './app/services/errors-interceptor.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([errorsInterceptor])),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
  ],
}).catch((err) => console.error(err));
