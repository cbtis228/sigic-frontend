import { Component } from '@angular/core';
import { PlanEstudioGeneralInfoCardComponent } from '../../../../components/plan-estudio-general-info-card/plan-estudio-general-info-card.component';
import { PlanEstudio } from '../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [
    PlanEstudioGeneralInfoCardComponent,
    CommonModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  planEstudio: PlanEstudio | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.academicoService.PlanEstudioDetailApi(Number(id)).subscribe({
      next: (response) => {
        this.planEstudio = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
