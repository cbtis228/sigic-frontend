import { Component } from '@angular/core';
import { Alumno } from '../../../../../../interfaces/alumno.interface';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { AlumnoGeneralInfoCardComponent } from '../../../components/alumno-general-info-card/alumno-general-info-card.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-general',
  imports: [AlumnoGeneralInfoCardComponent, ButtonModule, RouterModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  alumno: Alumno | null = null;

  constructor(private alumnoService: AlumnosService) {}

  ngOnInit(): void {
    this.alumnoService.AlumnoSelfDetailApi().subscribe({
      next: (response) => {
        this.alumno = response;
      },
      error: (error) => {
        console.error(error)
      },
    });
  }
}
