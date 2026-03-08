import { Component } from '@angular/core';
import { Grupo } from '../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GrupoGeneralInfoCardComponent } from '../../../../../../shared/grupo-general-info-card/grupo-general-info-card.component';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [
    ButtonModule,
    GrupoGeneralInfoCardComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  grupo: Grupo | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.academicoService.GrupoDetailApi(Number(id)).subscribe({
      next: (response) => {
        this.grupo = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
