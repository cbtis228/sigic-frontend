import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DocenteService } from '../../../../../../../services/docente.service';
import { Docente, DocenteUpdate } from '../../../../../../../interfaces/docente.interface';
import { DocenteEditGeneralCardComponent } from '../../../../components/docente-edit-general-card/docente-edit-general-card.component';
import { ErrorService } from '../../../../../../../services/error.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [
    DocenteEditGeneralCardComponent,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  docente!: Docente;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private docenteService: DocenteService,
    private messageService: MessageService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.docenteService.DocenteSelfDetailApi().subscribe({
      next: (response) => {
        this.docente = response
      },
      error: (error) => {
        const detail = this.errorService.formatError(error)
        this.messageService.add({detail, severity:'error'})
      },
    });
  }

  onSubmit(updatedDocente: DocenteUpdate): void {
    this.docenteService.DocenteSelfUpdateApi(updatedDocente).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Se actualizaron tus datos con éxito.',
          severity: 'success',
        });
        this.router.navigate(['..'], {relativeTo: this.route})
      },
      error: (error) => {
        const detail = this.errorService.formatError(error)
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }
}
