import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReparacionService } from '../services/reparacion.service';
import { AutenticacionService } from '../services/autenticacion.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	enviado: boolean;

	constructor(
		private formBuilder: FormBuilder,
		private servicioAutenticacion: AutenticacionService,
		private servicioReparacion: ReparacionService,
		private router: Router
	) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			usuario: ['', [Validators.required, Validators.minLength(4)]],
			password: ['', [Validators.required, Validators.minLength(5)]]
		});
	}

	get f() {
		return this.loginForm.controls;
	}

	onSubmit() {
		this.enviado = true;
		this.servicioAutenticacion.login(this.f.usuario.value, this.f.password.value).subscribe((rta) => {
			//Navegar al inicio
			this.router.navigate(['reparaciones']);
		}, (error) => {
			console.log(error);
			if (error.status === 401) {
				console.log("Contrseña erronea");
				Swal.fire({
					icon: 'error',
					title: 'Error de inicio de sesion',
					text: 'La contraseña o el usuario ingresados son incorrectos!',
					confirmButtonText: 'Aceptar',
					confirmButtonColor: '#0D6EFD',
				})
			}
		});
	}


	pedirReparaciones() {
		this.servicioReparacion.pedirReparaciones();
	}
}
