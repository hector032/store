import { HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core'; // Método para inyectar dependencias en proyectos standalone
import { catchError, Observable, throwError } from 'rxjs'; // Operadores de RxJS para manejar errores
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';

export const errorsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, // La solicitud HTTP que se va a interceptar
  next: HttpHandlerFn // La siguiente acción en la cadena de manejo HTTP
): Observable<HttpEvent<unknown>> => {
  const snackBar = inject(MatSnackBar); // Inyectamos el servicio MatSnackBar para mostrar notificaciones al usuario

  return next(req).pipe(
    // Procesamos el flujo HTTP y manejamos los errores
    catchError((error) => {
      console.error('Error interceptado:', error); // Registramos el error en la consola para depuración

      // Variable para almacenar el mensaje de error que se mostrará al usuario
      let mensajeError = 'Ocurrió un error desconocido.';

      // Determinamos el tipo de error y definimos un mensaje personalizado
      if (error.error instanceof ErrorEvent) {
        // Error del cliente o de red (por ejemplo, problemas de conexión)
        mensajeError = `Error del cliente: ${error.error.message}`;
      } else if (error.status === 401) {
        // Error de autenticación (usuario no autenticado)
        mensajeError = 'No estás autenticado. Por favor, inicia sesión.';
      } else if (error.status === 403) {
        // Error de autorización (acceso denegado)
        mensajeError = 'No tienes permiso para acceder a este recurso.';
      } else if (error.status === 404) {
        // Recurso no encontrado
        mensajeError = 'El recurso que estás buscando no existe.';
      } else if (error.status >= 500) {
        // Error del servidor (códigos 500 o superiores)
        mensajeError = `Error del servidor (${error.status}): ${error.message}`;
      }

      // Mostramos el mensaje de error en el Snackbar de Angular Material
      snackBar.open(mensajeError, 'Cerrar', {
        duration: 5000, // El mensaje se mostrará durante 5 segundos
        horizontalPosition: 'right', // Posición horizontal del Snackbar
        verticalPosition: 'top', // Posición vertical del Snackbar
      });

      // Relanzamos el error para que otras partes de la aplicación puedan manejarlo si es necesario
      return throwError(() => error);
    })
  );
};
