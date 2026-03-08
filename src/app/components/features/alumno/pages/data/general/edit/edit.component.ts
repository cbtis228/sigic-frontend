import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AlumnosService } from '../../../../../../../services/alumnos.service';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  Alumno,
  AlumnoUpdate,
} from '../../../../../../../interfaces/alumno.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnoEditGeneralCardComponent } from '../../../../components/alumno-edit-general-card/alumno-edit-general-card.component';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    AlumnoEditGeneralCardComponent,
    ButtonModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  alumno!: Alumno;

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.alumnoService.AlumnoSelfDetailApi().subscribe({
      next: (response) => {
        this.alumno = response;
      },
      error: () => {
        this.messageService.add({
          detail: 'Error al cargar los datos del alumno',
          severity: 'error',
        });
      },
    });
  }

  onSubmit(updatedAlumno: AlumnoUpdate): void {
    this.alumnoService.AlumnoSelfUpdateApi(updatedAlumno).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Se actualizaron los datos con éxito.',
          severity: 'success',
        });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          detail: 'Ocurrio un error.',
          severity: 'error',
        });
      },
    });
  }
}
