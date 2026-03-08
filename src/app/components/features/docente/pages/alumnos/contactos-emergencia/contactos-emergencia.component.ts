import { Component } from '@angular/core';
import { ContactoEmergencia } from '../../../../../../interfaces/alumno.interface';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ContactoEmergenciaCardComponent } from '../../../../alumno/components/contacto-emergencia-card/contacto-emergencia-card.component';
import { forkJoin } from 'rxjs';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-contactos-emergencia',
  imports: [
    ContactoEmergenciaCardComponent,
    CommonModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './contactos-emergencia.component.html',
  styleUrl: './contactos-emergencia.component.scss',
})
export class ContactosEmergenciaComponent {
  contactosEmergencia: ContactoEmergencia[] | null = null;

  constructor(
    private alumnoService: AlumnosService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    const numero_control = this.route.parent?.snapshot.paramMap.get('id');
    if (!numero_control) return;
    forkJoin([
      this.alumnoService.ContactoEmergenciaFromAlumnoApi(numero_control),
    ]).subscribe(([contactos]) => {
      this.contactosEmergencia = contactos;
    });
  }
}
