import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as MensajesValidacion from '../global.constants';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ValidadoresService {

  constructor(
    private translate: TranslateService
  ) { }

  campoInvalido(control: AbstractControl) {
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  obtenerErrores(control: AbstractControl) {
    let errores = [];
    for (const error in control.errors) {
      if (control.errors.hasOwnProperty(error)) {
        let mensaje = MensajesValidacion.MENSAJES_ERROR.find(mensaje => mensaje.value === error);
        if (error == 'minlength' || error == 'maxlength' || error == 'min' || error == 'max') {
          let data = control.errors[error].requiredLength;
          errores.push({ value: error, message: this.generarMensajeError(mensaje!.message, data.toString()) });
        }else{
          errores.push({ value: mensaje!.value, message: this.translate.instant(mensaje!.message) });
        }
      }
    }
    return errores;
  }

  generarMensajeError(mensaje: string, data: string) {
    let translation = this.translate.instant(mensaje);
    return translation.replace('{0}', data);
  }

}
