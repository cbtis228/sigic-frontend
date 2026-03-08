import { Component } from '@angular/core';
import { Materia } from '../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-detail-container',
  imports: [CommonModule, ButtonModule, RouterOutlet, RouterModule],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss'
})
export class DetailContainerComponent {

  materia: Materia | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;
    this.academicoService.MateriaDetailApi(Number(id)).subscribe({
      next: (response) => (this.materia = response),
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
