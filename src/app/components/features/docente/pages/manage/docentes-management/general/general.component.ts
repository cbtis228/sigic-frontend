import { Component } from '@angular/core';
import { DocenteGeneralInfoCardComponent } from '../../../../components/docente-general-info-card/general-info-card.component';
import { Docente } from '../../../../../../../interfaces/docente.interface';
import { DocenteService } from '../../../../../../../services/docente.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../services/error.service';
import { PermissionsService } from '../../../../../../../services/permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [
    DocenteGeneralInfoCardComponent,
    CommonModule,
    RouterModule,
    ButtonModule,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  docente: Docente | null = null;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private errorService: ErrorService,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit(): void {
    const id_docente = this.route.parent?.snapshot.paramMap.get('id');
    if (!id_docente) return;
    this.docenteService.DocenteDetailApi(Number(id_docente)).subscribe({
      next: (response) => {
        this.docente = response;
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({ detail, severity: 'error' });
      },
    });
  }
}
