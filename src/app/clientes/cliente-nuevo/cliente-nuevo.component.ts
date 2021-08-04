import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadosService } from 'src/app/services/estados.service';

@Component({
  selector: 'app-cliente-nuevo',
  templateUrl: './cliente-nuevo.component.html',
  styleUrls: ['./cliente-nuevo.component.css']
})
export class ClienteNuevoComponent implements OnInit {
  nuevoClienteForm: FormGroup;
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
		this.nuevoClienteForm = this.formBuilder.group({
			nombre: ['', [Validators.required, Validators.minLength(3)]],
			apellido: ['', [Validators.required, Validators.minLength(3)]],
			documento: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
			direccion: ['', [Validators.required, Validators.maxLength(20)]],
			codPostal: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
		});
	}

	get f() {
		return this.nuevoClienteForm.controls;
	}

	onSubmit() {
		this.enviado = true;
  }

}
