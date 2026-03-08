import { Component } from '@angular/core';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Salon } from '../../../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-detail-container',
  imports: [ButtonModule, CommonModule, RouterOutlet, RouterModule],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss',
})
export class DetailContainerComponent {
  salon: Salon | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;
    this.academicoService.SalonDetailApi(Number(id)).subscribe({
      next: (response) => (this.salon = response),
    });
  }

  getEstatusText(estatus: number) {
    switch (estatus) {
      case 1:
        return 'Activo';
      case 2:
        return 'Inactivo';
      case 3:
        return 'Egresado';
      default:
        return 'Desconocido';
    }
  }

  getEstatusClass(estatus: number) {
    switch (estatus) {
      case 1:
        return 'border-green-300 text-green-700 bg-green-100';
      case 2:
        return 'border-orange-300 text-orange-700 bg-orange-100';
      case 3:
        return 'border-blue-300 text-blue-700 bg-blue-100';
      default:
        return 'border-gray-300 text-gray-700 bg-gray-100';
    }
  }
}
