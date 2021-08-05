import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReparacionService } from '../services/reparacion.service';
@Component({
  selector: 'app-reparacion',
  templateUrl: './reparacion.component.html',
  styleUrls: ['./reparacion.component.css']
})
export class ReparacionComponent implements OnInit {
  filtrarReparacionesForm: FormGroup;
  reparaciones: any;
  orderIDDesc: boolean;
  orderNombreDesc: boolean;

  constructor(private servicioReparaciones: ReparacionService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.filtrarReparacionesForm = this.formBuilder.group({
      filtro: ['']
    });

    this.cargarDatos();
  }

  cargarDatos() {
    this.servicioReparaciones.pedirReparaciones().subscribe((rta:any) => {
      // console.log(rta.content);
      this.reparaciones = rta.content;
      for (let i = 0; i < this.reparaciones.length; i++) {
        this.reparaciones[i].descripcionVehiculo = this.reparaciones[i].descripcionVehiculo.split('|').join('');
        // console.log(this.reparaciones[i]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  nuevaReparacion() {
    this.router.navigate(["reparaciones/nueva"]);
  }

  ver(id: number) {
    this.router.navigate(["reparaciones", id]);
    this.servicioReparaciones.pedirReparacion(id).subscribe((rta: any) => {
      console.log(rta);
      if (rta && rta.content) {
        this.reparaciones = rta.content;
        console.log(rta.content);
      } else {
        this.reparaciones = rta;
      }
    }, (error) => {
      console.log(error);
    });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Seguro que desea continuar?',
      text: "No podrá revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this.servicioReparaciones.eliminarReparacion(id).subscribe((rta: any) => {
          console.log(rta);
          Swal.fire({
            icon: 'success',
            title: 'Reparación eliminada',
            text: 'La reparación ha sido eliminada de la BD exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          }) 
          window.location.reload();
        }, (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La reparación no ha podido ser eliminada',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#0D6EFD',
          })
        });
      }
    })
  }

  get f() {
    return this.filtrarReparacionesForm.controls;
  }

  filtrar() {
    this.filtrarImpl(this.f.filtro.value);
  }

  filtrarImpl(value: string, estrategia?: string, orden?: string) {
    this.servicioReparaciones.pedirReparacionesFiltradasPorNombre(value, orden).subscribe((rta: any) => {
      // console.log(rta);
      if (rta && rta.content) {
        this.reparaciones = rta.content;
        console.log(rta.content);
      } else {
        this.reparaciones = rta;
      }
    }, (error) => {
      console.log(error);
    });
  }

  limpiar() {
    this.f.filtro.setValue('');
    this.filtrar();
  }

  keyPress(evento: KeyboardEvent) {
    if (evento.keyCode === 13) {
      this.filtrarImpl(this.f.filtro.value);
    }
  }
 
  ordenar(estrategia: string) {
    if (estrategia === 'nombre') {
      this.orderNombreDesc = !this.orderNombreDesc;
      this.filtrarImpl(this.f.filtro.value, estrategia, this.orderNombreDesc ? 'nombre,desc' : 'nombre,asc');
    } 
  }

  
}
