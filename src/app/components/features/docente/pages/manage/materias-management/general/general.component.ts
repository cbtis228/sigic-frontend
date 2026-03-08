import { Component } from '@angular/core';
import { Materia } from '../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MateriaGeneralInfoCardComponent } from '../../../../components/materia-general-info-card/materia-general-info-card.component';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [
    ButtonModule,
    CommonModule,
    MateriaGeneralInfoCardComponent,
    RouterModule,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  materia: Materia | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.academicoService.MateriaDetailApi(Number(id)).subscribe({
      next: (response) => {
        this.materia = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
