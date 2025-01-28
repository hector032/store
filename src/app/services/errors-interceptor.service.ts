import { HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

export const errorsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const snackBar = inject(MatSnackBar); // Inyectamos el servicio MatSnackBar para mostrar notificaciones al usuario

  return next(req).pipe(
    // Ahora 'error' tiene un tipo específico: HttpErrorResponse
    catchError((error: HttpErrorResponse) => {
      console.error('Error interceptado:', error); // Registramos el error en la consola para depuración
      let mensajeError = 'Ocurrió un error desconocido.';

      // Determinamos el tipo de error y definimos un mensaje personalizado
      if (error.error instanceof ErrorEvent) {
        mensajeError = `Error del cliente: ${error.error.message}`;
      } else if (error.status === 401) {
        mensajeError = 'No estás autenticado. Por favor, inicia sesión.';
      } else if (error.status === 403) {
        mensajeError = 'No tienes permiso para acceder a este recurso.';
      } else if (error.status === 404) {
        mensajeError = 'El recurso que estás buscando no existe.';
      } else if (error.status >= 500) {
        mensajeError = `Error del servidor (${error.status}): ${error.message}`;
      }

      snackBar.open(mensajeError, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      return throwError(() => error); // Relanzamos el error para que otras partes de la aplicación puedan manejarlo si es necesario
    })
  );
};
