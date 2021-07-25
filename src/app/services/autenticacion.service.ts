import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

	private token: string;
	
	constructor(private http: HttpClient) { }
	
	login(usuario: string, pass: string) {
		var tokenUsuario = 'Basic ' + window.btoa(usuario + ':' + pass);
		var opciones = {
			headers: new HttpHeaders({'Authorization' : tokenUsuario })
		}
		return this.http.get(environment.url + 'login', opciones).pipe(
			map((rta) => {
				//Se logueo con exito
				console.log('pipe -> map');
				// this.token = tokenUsuario;
				localStorage.setItem('token', tokenUsuario);
				localStorage.setItem('usuario', JSON.stringify(rta));
			})
		);
	}
	get tokenAutorizado() {
		return localStorage.getItem('token');
	}
	get usuarioLogueado() {
		return JSON.parse(localStorage.getItem('usuario'));
	}
}