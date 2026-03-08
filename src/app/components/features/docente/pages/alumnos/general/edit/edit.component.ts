import { Component, OnInit } from '@angular/core';
import { Alumno, AlumnoUpdate } from '../../../../../../../interfaces/alumno.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../../../../../services/alumnos.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AlumnoEditGeneralCardComponent } from '../../../../../alumno/components/alumno-edit-general-card/alumno-edit-general-card.component';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, InputTextModule, ButtonModule, ReactiveFormsModule, AlumnoEditGeneralCardComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  numeroControl!: Alumno['numero_control']
  alumno!: Alumno

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.numeroControl = this.route.parent?.snapshot.paramMap.get(
      'id',
    ) as Alumno['numero_control'];
    this.alumnoService.AlumnoDetailApi(this.numeroControl).subscribe({
      next: (response) => {
        this.alumno = response
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
    this.alumnoService.AlumnoUpdateApi(this.numeroControl, updatedAlumno).subscribe({
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
