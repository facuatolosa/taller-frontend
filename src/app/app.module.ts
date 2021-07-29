import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InterceptorHttpService } from './services/interceptor-http.service';
import { appRoutingModule } from './rutas/rutas-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { ReparacionComponent } from './reparacion/reparacion.component';
import { ReparacionNuevaComponent } from './reparacion/reparacion-nueva/reparacion-nueva.component';
import { ReparacionDetalleComponent } from './reparacion/reparacion-detalle/reparacion-detalle.component';
import { ClienteNuevoComponent } from './clientes/cliente-nuevo/cliente-nuevo.component';


@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		LoginComponent,
		InicioComponent,
		ReparacionComponent,
		ReparacionNuevaComponent,
		ReparacionDetalleComponent,
		ClienteNuevoComponent,
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		HttpClientModule,
		appRoutingModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: InterceptorHttpService, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }