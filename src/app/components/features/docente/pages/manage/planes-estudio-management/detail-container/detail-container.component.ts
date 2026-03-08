import { Component } from '@angular/core';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { PlanEstudio } from '../../../../../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { defaultEstatusValuePipe } from '../../../../../../../pipes/default-estatus-value.pipe';

@Component({
  selector: 'app-detail-container',
  imports: [CommonModule, ButtonModule, RouterOutlet, RouterModule, defaultEstatusValuePipe],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss'
})
export class DetailContainerComponent {

  planEstudio: PlanEstudio | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;
    this.academicoService.PlanEstudioDetailApi(Number(id)).subscribe({
      next: (response) => (this.planEstudio = response),
    });
  }

  getEstatusText(estatus: number): string {
    return estatus === 1 ? 'Activo' : 'Inactivo';
  }

  getEstatusClass(estatus: number): string {
    return estatus === 1
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  }
}
