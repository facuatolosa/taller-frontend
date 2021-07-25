import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
	providedIn: 'root'
})
export class InterceptorHttpService implements HttpInterceptor {

	constructor(private servicioAutenticacion: AutenticacionService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		console.log('Inteceptando... ' + req.url);
		var token = this.servicioAutenticacion.tokenAutorizado;
		if (token) {
			req = req.clone({
				setHeaders: {
					'Authorization': token
				}
			});
		}
		return next.handle(req);
	}
}
