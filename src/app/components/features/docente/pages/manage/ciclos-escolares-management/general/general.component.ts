import { Component } from '@angular/core';
import { CicloEscolar } from '../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CicloEscolaGeneralInfoCardComponent } from '../../../../../../shared/ciclo-escolar-general-info-card/ciclo-escolar-general-info-card.component';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [
    CicloEscolaGeneralInfoCardComponent,
    CommonModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  cicloEscolar: CicloEscolar | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.academicoService.CicloEscolarDetailApi(Number(id)).subscribe({
      next: (response) => {
        this.cicloEscolar = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
