import { Component } from '@angular/core';
import {
  Grupo,
  GrupoUpdate,
} from '../../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../../services/academico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../../services/error.service';
import { GrupoEditGeneralCardComponent } from "../../../../../components/grupo-edit-general-card/grupo-edit-general-card.component";

@Component({
  selector: 'app-edit',
  imports: [GrupoEditGeneralCardComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  grupoId!: Grupo['id'];
  grupo!: Grupo;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    const id_grupo = this.route.parent?.snapshot.paramMap.get('id');
    if (!id_grupo) return;
    this.grupoId = Number(id_grupo);
    this.academicoService.GrupoDetailApi(this.grupoId).subscribe({
      next: (response) => {
        this.grupo = response;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los datos del grupo',
          severity: 'error',
        });
      },
    });
  }

  onSubmit(updatedGrupo: GrupoUpdate): void {
    this.academicoService.GrupoUpdateApi(this.grupoId, updatedGrupo).subscribe({
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
