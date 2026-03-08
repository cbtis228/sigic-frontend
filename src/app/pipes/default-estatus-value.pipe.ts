import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultEstatusValue'
})
export class defaultEstatusValuePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    switch(value){
      case 1:
        return 'Activo'
      case 2:
        return 'Inactivo'
    }
    return 'Otro'
  }

}
