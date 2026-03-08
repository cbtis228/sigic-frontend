import { Component } from '@angular/core';
import { CicloEscolarEditGeneralCardComponent } from '../../../../../components/ciclo-escolar-edit-general-card/ciclo-escolar-edit-general-card.component';
import {
  CicloEscolar,
  CicloEscolarUpdate,
} from '../../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../../services/academico.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../../services/error.service';

@Component({
  selector: 'app-edit',
  imports: [CicloEscolarEditGeneralCardComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  cicloEscolarId!: CicloEscolar['id'];
  cicloEscolar!: CicloEscolar;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    const id_cicloEscolar = this.route.parent?.snapshot.paramMap.get('id');
    if (!id_cicloEscolar) return;
    this.cicloEscolarId = Number(id_cicloEscolar);
    this.academicoService.CicloEscolarDetailApi(this.cicloEscolarId).subscribe({
      next: (response) => {
        this.cicloEscolar = response;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los datos del cicloEscolar',
          severity: 'error',
        });
      },
    });
  }

  onSubmit(updatedCicloEscolar: CicloEscolarUpdate): void {
    this.academicoService
      .CicloEscolarUpdateApi(this.cicloEscolarId, updatedCicloEscolar)
      .subscribe({
        next: () => {
          this.messageService.add({
            detail: 'Se actualizaron los datos con éxito.',
            severity: 'success',
          });
          this.router.navigate(['..'], { relativeTo: this.route }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }
}
