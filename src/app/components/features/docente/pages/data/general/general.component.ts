import { Component } from '@angular/core';
import { DocenteGeneralInfoCardComponent } from '../../../components/docente-general-info-card/general-info-card.component';
import { DocenteService } from '../../../../../../services/docente.service';
import { Docente } from '../../../../../../interfaces/docente.interface';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ErrorService } from '../../../../../../services/error.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-general',
  imports: [DocenteGeneralInfoCardComponent, ButtonModule, RouterModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  docente: Docente | null = null;

  constructor(
    private messageService: MessageService,
    private docenteService: DocenteService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.docenteService.DocenteSelfDetailApi().subscribe({
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
