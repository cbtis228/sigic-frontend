import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Alumno } from '../../../../../../interfaces/alumno.interface';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-detail-container',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss',
})
export class DetailContainerComponent implements OnInit {

  alumno: Alumno | null = null
  permissions: Record<string, boolean> = {};

  constructor(
    private alumnoService: AlumnosService,
    private route: ActivatedRoute,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    const numero_control = this.route.snapshot.paramMap.get('id');

    if (!numero_control) return;
    this.alumnoService.AlumnoDetailApi(numero_control).subscribe({
      next: (response) => (this.alumno = response),
    });
  }
}
