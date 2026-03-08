import { Component, OnInit } from '@angular/core';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import {
  Grupo,
} from '../../../../../../../interfaces/academico.interface';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-container',
  imports: [ButtonModule, CommonModule, DatePipe, RouterOutlet, RouterModule],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss',
})
export class DetailContainerComponent implements OnInit {
  grupo: Grupo | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;
    this.academicoService.GrupoDetailApi(Number(id)).subscribe({
      next: (response) => (this.grupo = response),
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
