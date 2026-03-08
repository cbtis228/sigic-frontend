import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Docente } from '../../../../../../../interfaces/docente.interface';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../../../../../../../services/docente.service';
import { ErrorService } from '../../../../../../../services/error.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail-container',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './detail-container.component.html',
  styleUrl: './detail-container.component.scss',
})
export class DetailContainerComponent implements OnInit {
  docente: Docente | null = null;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id_docente = this.route.snapshot.paramMap.get('id');

    if (!id_docente) return;
    this.docenteService.DocenteDetailApi(Number(id_docente)).subscribe({
      next: (response) => (this.docente = response),
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail,
        });
      },
    });
  }
}
