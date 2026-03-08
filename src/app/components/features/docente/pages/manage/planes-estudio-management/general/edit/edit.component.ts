import { Component } from '@angular/core';
import { PlanEstudio, PlanEstudioUpdate } from '../../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../../services/academico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../../services/error.service';
import { PlanEstudioEditGeneralCardComponent } from "../../../../../components/plan-estudio-edit-general-card/plan-estudio-edit-general-card.component";

@Component({
  selector: 'app-edit',
  imports: [PlanEstudioEditGeneralCardComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  planEstudioId!: PlanEstudio['id'];
  planEstudio!: PlanEstudio;

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
    this.planEstudioId = Number(id_grupo);
    this.academicoService.PlanEstudioDetailApi(this.planEstudioId).subscribe({
      next: (response) => {
        this.planEstudio = response;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los datos del planEstudio',
          severity: 'error',
        });
      },
    });
  }

  onSubmit(updatedPlanEstudio: PlanEstudioUpdate): void {
    this.academicoService.PlanEstudioUpdateApi(this.planEstudioId, updatedPlanEstudio).subscribe({
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
