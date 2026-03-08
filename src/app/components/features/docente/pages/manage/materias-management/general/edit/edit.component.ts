import { Component } from '@angular/core';
import { MateriaEditGeneralCardComponent } from "../../../../../components/materia-edit-general-card/materia-edit-general-card.component";
import { Materia, MateriaUpdate } from '../../../../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../../../../services/academico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../../../../../services/error.service';

@Component({
  selector: 'app-edit',
  imports: [MateriaEditGeneralCardComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  materiaId!: Materia['id'];
  materia!: Materia;

  constructor(
    private academicoService: AcademicoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    const id_grupo = this.route.parent?.snapshot.paramMap.get('id');
    if (!id_grupo) return;
    this.materiaId = Number(id_grupo);
    this.academicoService.MateriaDetailApi(this.materiaId).subscribe({
      next: (response) => {
        this.materia = response;
      },
      error: (error) => {
        this.messageService.add({
          detail: 'Error al cargar los datos del materia',
          severity: 'error',
        });
      },
    });
  }

  onSubmit(updatedMateria: MateriaUpdate): void {
    this.academicoService.MateriaUpdateApi(this.materiaId, updatedMateria).subscribe({
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
