import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
	providedIn: 'root'
})
export class Authguard implements CanActivate {

	constructor(private servicioAutenticacion: AutenticacionService,
		private router : Router) { }
	path: ActivatedRouteSnapshot[];
	route: ActivatedRouteSnapshot;

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		let usuarioLogueado = this.servicioAutenticacion.usuarioLogueado;
		if (usuarioLogueado && usuarioLogueado.authenticated) {
			return true;
		}
		//obligamos a ir al login
		this.router.navigate(['login']);
		return false;
	}
}