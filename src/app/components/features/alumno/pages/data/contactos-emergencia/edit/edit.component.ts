import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { AlumnosService } from '../../../../../../../services/alumnos.service';
import { ButtonModule } from 'primeng/button';
import { ContactoEmergencia, ContactoEmergenciaUpdate } from '../../../../../../../interfaces/alumno.interface';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EditContactosEmergenciaCardComponent } from '../../../../components/edit-contactos-emergencia-card/edit-contactos-emergencia-card.component';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    EditContactosEmergenciaCardComponent,
    RouterModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  contactos!: ContactoEmergencia[]

  constructor(
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.alumnoService.ContactoEmergenciaSelfListApi().subscribe({
      next: (response) => {
        this.contactos = response
      },
    });
  }

  onSubmit(contactos: ContactoEmergenciaUpdate[]) {
    const updates$ = contactos.map((contacto) =>
      this.alumnoService.ContactoEmergenciaSelfUpdateApi(contacto.id, contacto),
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
