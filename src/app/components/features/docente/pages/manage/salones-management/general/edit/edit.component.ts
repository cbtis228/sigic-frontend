import { Component } from '@angular/core';
import { Salon, SalonUpdate } from '../../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../../services/academico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../../services/error.service';
import { SalonEditGeneralCardComponent } from '../../../../../../../shared/salon-edit-general-card/salon-edit-general-card.component';

@Component({
  selector: 'app-edit',
  imports: [SalonEditGeneralCardComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  salonId!: Salon['id'];
  salon!: Salon;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    const id_salon = this.route.parent?.snapshot.paramMap.get('id');
    if (!id_salon) return;
    this.salonId = Number(id_salon);
    this.academicoService.SalonDetailApi(this.salonId).subscribe({
      next: (response) => {
        this.salon = response;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los datos del salon',
          severity: 'error',
        });
      },
    });
  }

  onSubmit(updatedSalon: SalonUpdate): void {
    this.academicoService
      .SalonUpdateApi(this.salonId, updatedSalon)
      .subscribe({
        next: () => {
          this.messageService.add({
            detail: 'Se actualizaron los datos con éxito.',
            severity: 'success',
          });
          this.router.navigate(['..'], { relativeTo: this.route }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }
}
