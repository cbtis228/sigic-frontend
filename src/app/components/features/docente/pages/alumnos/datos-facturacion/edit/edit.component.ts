import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../../../../../../../services/alumnos.service';
import {
  Alumno,
  DatosFacturacion,
  DatosFacturacionUpdate,
} from '../../../../../../../interfaces/alumno.interface';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDatosFacturacionComponent } from '../../../../../alumno/components/edit-datos-facturacion-card/edit-datos-facturacion-card.component';

@Component({
  selector: 'app-edit',
  imports: [EditDatosFacturacionComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  datosFacturacion!: DatosFacturacion;
  numeroControl!: Alumno['numero_control'];

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.numeroControl = this.route.parent?.snapshot.paramMap.get(
      'id',
    ) as Alumno['numero_control'];
    this.alumnoService
      .DatosFacturacionFromAlumnoApi(this.numeroControl)
      .subscribe({
        next: (response) => {
          this.datosFacturacion = response;
        },
      });
  }

  onSubmit(updatedDatosFacturacion: DatosFacturacionUpdate): void {
    this.alumnoService
      .DatosFacturacionUpdateApi(this.numeroControl, updatedDatosFacturacion)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Datos actualizados con exito',
          });
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: () => {
          this.messageService.add({
            detail: 'Ocurrio un error al actualizar los datos',
            severity: 'error',
          });
        },
      });
  }
}
