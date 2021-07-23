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
import { DominioComponent } from './dominio/dominio.component';
import { DominioNuevoComponent } from './dominio/dominio-nuevo/dominio-nuevo.component';



@NgModule({
  declarations: [
		AppComponent,
	    HeaderComponent,
	    FooterComponent,
	    LoginComponent,
	    InicioComponent,
	    DominioComponent,
	    DominioNuevoComponent,
  ],
  imports: [
	  BrowserModule,
	  ReactiveFormsModule,
	  HttpClientModule,
	  appRoutingModule
  ],
	providers: [
	  { provide: HTTP_INTERCEPTORS, useClass : InterceptorHttpService, multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }