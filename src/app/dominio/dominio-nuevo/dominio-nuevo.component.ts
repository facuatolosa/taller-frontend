import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DominioService } from 'src/app/services/dominio.service';
import Swal from 'sweetalert2';


@Component({
	selector: 'app-dominio-nuevo',
	templateUrl: './dominio-nuevo.component.html',
	styleUrls: ['./dominio-nuevo.component.css']
})
export class DominioNuevoComponent implements OnInit {

	formulario: FormGroup;
	titulo: string;
	modoNuevo: boolean;
	dominio: any;
	enviado: boolean;

	constructor(
		private formBuilder: FormBuilder,
		public rutaActiva: ActivatedRoute,
		public servicioDominio: DominioService,
		public router: Router
	) { }

	ngOnInit() {

		this.formulario = this.formBuilder.group({
			nombre: ['', [Validators.required, Validators.minLength(4)]],
		});
		if (this.rutaActiva.snapshot.params.id !== 'nuevo') { //Modo editar
			this.titulo = "Editar dominio";
			this.modoNuevo = false;
			this.servicioDominio.get(this.rutaActiva.snapshot.params.id).subscribe((rta: any) => {
				//completar el resto de los valores
				this.f.nombre.setValue(rta.nombreDominio);
				this.dominio = rta;
			});
		} else {
			this.titulo = "Nuevo dominio";
			this.modoNuevo = true;
		}
	}

	get f() {
		return this.formulario.controls;
	}

	onSubmit() {

		Swal.fire({
			title: 'Esta seguro que desea continuar?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, claro!'
		}).then((result) => {
			if (result.value) {
				//Me fijo en el modo de pantalla
				if (this.modoNuevo) {
					var nuevoDominio: any;
					nuevoDominio = {};
					nuevoDominio.nombreDominio = this.f.nombre.value;
					this.servicioDominio.guardar(nuevoDominio).subscribe((rta) => {
						this.router.navigate(["dominios"]);
					}, (error) => {
						alert('Error al cargar');
					});
				} else {
					//Actualizo el modelo de acuerdo a los valores de los input del formulario
					this.dominio.nombreDominio = this.f.nombre.value;
					this.servicioDominio.actualizar(this.dominio).subscribe((rta) => {
						Swal.fire({ icon: 'success', title: 'Exito', allowOutsideClick: false, text: 'Texto' });
						this.router.navigate(["dominios"]);
					}, (error) => {
						console.error(error);
						Swal.fire({ icon: 'error', title: 'Error!!', allowOutsideClick: false, text: error.message });
					});
				}
			}
		})




	}

}
