import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reparacion-detalle',
  templateUrl: './reparacion-detalle.component.html',
  styleUrls: ['./reparacion-detalle.component.css']
})
export class ReparacionDetalleComponent implements OnInit {
  formulario: FormGroup;
  titulo: string;
  modoEditar: boolean;
  enviado: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public rutaActiva: ActivatedRoute,
    public router: Router    
  ) { }

  ngOnInit(): void {
    this.modoEditar=false;
    if(!this.modoEditar){
      this.titulo="Detalle de";
    }
  }

  onSubmit() {

		Swal.fire({
			title: '¿Esta seguro que desea continuar?',
			text: "Los cambios no podrán ser revertidos!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Aceptar'
		}).then((result) => {
			if (result.value) {
				//Me fijo en el modo de pantalla
				if (this.modoEditar) {
          console.log("Modo Editar");
					// //Actualizo el modelo de acuerdo a los valores de los input del formulario
					// this.dominio.nombreDominio = this.f.nombre.value;
					// this.servicioDominio.actualizar(this.dominio).subscribe((rta) => {
					// 	Swal.fire({ icon: 'success', title: 'Exito', allowOutsideClick: false, text: 'Texto' });
					// 	this.router.navigate(["dominios"]);
					// }, (error) => {
					// 	console.error(error);
					// 	Swal.fire({ icon: 'error', title: 'Error!!', allowOutsideClick: false, text: error.message });
					// });
				} else {
          console.log("Modo Ver");
				}
			}
		})




	}

}
