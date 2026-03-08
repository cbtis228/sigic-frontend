import { Component } from '@angular/core';
import { Alumno } from '../../../../../../interfaces/alumno.interface';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AlumnoGeneralInfoCardComponent } from '../../../../alumno/components/alumno-general-info-card/alumno-general-info-card.component';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-general',
  imports: [
    CommonModule,
    ButtonModule,
    AlumnoGeneralInfoCardComponent,
    RouterModule,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  alumno: Alumno | null = null;

  constructor(
    private alumnoService: AlumnosService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    const numero_control = this.route.parent?.snapshot.paramMap.get('id');
    if (!numero_control) return;
    this.alumnoService.AlumnoDetailApi(numero_control).subscribe({
      next: (response) => {
        this.alumno = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
