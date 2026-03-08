import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alumnoEstatusValue'
})
export class AlumnoEstatusValuePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    switch(value){
      case 1:
        return 'Activo'
      case 2:
        return 'Inactivo'
      case 3:
        return 'Egresado'
    }
    return 'Otro'
  }

}
