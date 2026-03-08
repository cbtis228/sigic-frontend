import { Component, OnInit } from '@angular/core';
import { SalonGeneralInfoCardComponent } from '../../../../../../shared/salon-general-info-card/salon-general-info-card.component';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { Salon } from '../../../../../../../interfaces/academico.interface';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [
    SalonGeneralInfoCardComponent,
    CommonModule,
    RouterLink,
    ButtonModule,
    AsyncPipe,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent implements OnInit {
  salon: Salon | null = null;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit() {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.academicoService.SalonDetailApi(Number(id)).subscribe({
      next: (response) => {
        this.salon = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
