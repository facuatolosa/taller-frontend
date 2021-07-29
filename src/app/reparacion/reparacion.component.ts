import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReparacionService } from '../services/reparacion.service';
@Component({
  selector: 'app-reparacion',
  templateUrl: './reparacion.component.html',
  styleUrls: ['./reparacion.component.css']
})
export class ReparacionComponent implements OnInit {
  filtrarReparacionesForm: FormGroup;
  reparaciones: any;
  orderIDDesc: boolean = undefined;
  orderNombreDesc: boolean = undefined;

  constructor(private servicioReparaciones: ReparacionService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.filtrarReparacionesForm = this.formBuilder.group({
      filtro: ['']
    });

    // Debo pedir los dominios al backend
    this.cargarDatos();
  }
  cargarDatos() {
    this.servicioReparaciones.pedirReparaciones().subscribe((rta) => {
      console.log(rta);
      this.reparaciones = rta;
    }, (error) => {
      console.log(error);
    });
  }

  nuevaReparacion() {
    this.router.navigate(["reparaciones/nueva"]);
  }

  ver(id: number) {
    this.router.navigate(["reparaciones", id]);
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
      console.log("Nombre Order Value: " + this.orderNombreDesc);
      this.filtrarImpl(this.f.filtro.value, estrategia, this.orderNombreDesc ? 'nombre,desc' : 'nombre,asc');
    } else if (estrategia === 'id'){
      this.orderIDDesc = !this.orderIDDesc;
      console.log("ID Order Value: " + this.orderIDDesc);
      this.filtrarImpl(this.f.filtro.value, estrategia, this.orderIDDesc ? 'id,desc' : 'id,asc');
    }
  }

  
}
