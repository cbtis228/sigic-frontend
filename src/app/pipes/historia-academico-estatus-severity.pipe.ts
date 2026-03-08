import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historialAcademicoEstatusSeverity'
})
export class HistorialAcademicoEstatusSeverityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    switch(value){
      case 1:
        return 'success'
      case 2:
        return 'danger'
      case 3:
        return 'info'
    }
    return 'secondary'
  }

}
