import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../../../../../../../services/alumnos.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ContactoEmergencia,
  ContactoEmergenciaUpdate,
} from '../../../../../../../interfaces/alumno.interface';
import { forkJoin } from 'rxjs';
import { EditContactosEmergenciaCardComponent } from '../../../../../alumno/components/edit-contactos-emergencia-card/edit-contactos-emergencia-card.component';

@Component({
  selector: 'app-edit',
  imports: [EditContactosEmergenciaCardComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  contactos!: ContactoEmergencia[];

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const numero_control = this.route.parent?.snapshot.paramMap.get('id');
    if(!numero_control) return
    this.alumnoService.ContactoEmergenciaFromAlumnoApi(numero_control).subscribe({
      next: (response) => {
        this.contactos = response;
      },
    });
  }

  onSubmit(contactos: ContactoEmergenciaUpdate[]) {
    const updates$ = contactos.map((contacto) =>
      this.alumnoService.ContactoEmergenciaUpdateApi(contacto.id, contacto),
    );

    forkJoin(updates$).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Contactos Actualizados Correctamente',
          severity: 'success',
        });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error al actualizar contactos', err);
      },
    });
  }
}
