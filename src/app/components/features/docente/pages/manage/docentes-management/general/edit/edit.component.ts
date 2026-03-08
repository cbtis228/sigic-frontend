import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocenteService } from '../../../../../../../../services/docente.service';
import { Docente, DocenteUpdate } from '../../../../../../../../interfaces/docente.interface';
import { DocenteEditGeneralCardComponent } from '../../../../../components/docente-edit-general-card/docente-edit-general-card.component';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    DocenteEditGeneralCardComponent,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  docenteId!: Docente['id_docente'];
  docente!: Docente;

  constructor(
    private docenteService: DocenteService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id_docente = this.route.parent?.snapshot.paramMap.get('id');
    if (!id_docente) return;
    this.docenteId = Number(id_docente);
    this.docenteService.DocenteDetailApi(this.docenteId).subscribe({
      next: (response) => {
        this.docente = response;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los datos del docente',
          severity: 'error',
        });
      },
    });
  }

  onSubmit(updatedDocente:DocenteUpdate): void {
    this.docenteService
      .DocenteUpdateApi(this.docenteId, updatedDocente)
      .subscribe({
        next: () => {
          this.messageService.add({
            detail: 'Se actualizaron tus datos con éxito.',
            severity: 'success',
          });
          this.router.navigate(['..'], { relativeTo: this.route }).then(() => {
            window.location.reload();
          });
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
