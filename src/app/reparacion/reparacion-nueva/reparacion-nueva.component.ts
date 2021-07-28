import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReparacionService } from 'src/app/services/reparacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reparacion-nueva',
  templateUrl: './reparacion-nueva.component.html',
  styleUrls: ['./reparacion-nueva.component.css']
})
export class ReparacionNuevaComponent implements OnInit {
  formulario: FormGroup;
  titulo: string;
  modoNuevo: boolean;
  reparacion: any;
  enviado: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public rutaActiva: ActivatedRoute,
    public servicioReparacion: ReparacionService,
    public router: Router
  ) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
    });
    if (this.rutaActiva.snapshot.params.id !== 'nuevo') { //Modo editar
      this.titulo = "Editar reparacion";
      this.modoNuevo = false;
      this.servicioReparacion.get(this.rutaActiva.snapshot.params.id).subscribe((rta: any) => {
        //completar el resto de los valores
        // this.f.nombre.setValue(rta.nombre);
        // this.reparacion = rta;
      });
    } else {
      this.titulo = "Nueva reparacion";
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
          var nuevaReparacion: any;
          nuevaReparacion = {};
          nuevaReparacion.nombreDominio = this.f.nombre.value;
          this.servicioReparacion.guardar(nuevaReparacion).subscribe((rta) => {
            this.router.navigate(["dominios"]);
          }, (error) => {
            alert('Error al cargar');
          });
        } else {
          //Actualizo el modelo de acuerdo a los valores de los input del formulario
          this.reparacion.nombreDominio = this.f.nombre.value;
          this.servicioReparacion.actualizar(this.reparacion).subscribe((rta) => {
            Swal.fire({ icon: 'success', title: 'Exito', allowOutsideClick: false, text: 'Texto' });
            this.router.navigate(["reparaciones"]);
          }, (error) => {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error!!', allowOutsideClick: false, text: error.message });
          });
        }
      }
    })




  }


}