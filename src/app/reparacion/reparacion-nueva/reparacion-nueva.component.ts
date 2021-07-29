import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadosService } from 'src/app/services/estados.service';

@Component({
  selector: 'app-reparacion-nueva',
  templateUrl: './reparacion-nueva.component.html',
  styleUrls: ['./reparacion-nueva.component.css']
})
export class ReparacionNuevaComponent implements OnInit {
  formulario: FormGroup;
  titulo: string;
  modoNuevo: boolean;
  estados: any;
  enviado: boolean;

  constructor(
    private servicioEstados: EstadosService,
    private formBuilder: FormBuilder,
    public rutaActiva: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.cargarDatos();
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],

    });
  }

  cargarDatos() {
		this.servicioEstados.pedirEstados().subscribe((rta) => {
			console.log(rta);
			this.estados = rta;
		}, (error) => {
			console.log(error);
		});
	}

  get f() {
    return this.formulario.controls;
  }

  onSubmit() {

  }


}