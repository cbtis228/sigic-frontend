import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Horario } from '../../../interfaces/academico.interface';
import { CommonModule } from '@angular/common';
import { CardWithTitleComponent } from '../card-with-title/card-with-title.component';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
  selector: 'app-horario-semanal-card',
  imports: [CommonModule, CardWithTitleComponent],
  templateUrl: './horario-semanal-card.component.html',
  styleUrl: './horario-semanal-card.component.scss',
})
export class HorarioSemanalCardComponent {
  constructor(public permissionsService: PermissionsService) {}

  @Input() horarios: Horario[] = [];
  @Input() showActions = false;
  @Input() showHeader = true;
  @Input() showGrupo = false;
  @Output() onEditClick = new EventEmitter<Horario>();
  @Output() onDeleteClick = new EventEmitter<Horario['id']>();

  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  diaActivo = 'Lunes';

  get horariosPorDia() {
    const map: { [key: string]: Horario[] } = {};
    for (const d of this.dias) map[d] = [];
    this.horarios.forEach((h) => {
      const dia = this.dias[h.dia_semana - 1];
      if (dia) map[dia].push(h);
    });
    this.dias.forEach((d) =>
      map[d].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)),
    );
    return map;
  }

  trimHora(hora: string): string {
    return hora ? hora.substring(0, 5) : '';
  }
}
