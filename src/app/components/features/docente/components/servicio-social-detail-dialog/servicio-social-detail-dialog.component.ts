import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ServicioSocial } from '../../../../../interfaces/academico.interface';

@Component({
  selector: 'app-servicio-social-detail-dialog',
  standalone: true,
  imports: [DialogModule, CommonModule],
  templateUrl: './servicio-social-detail-dialog.component.html',
  styleUrls: ['./servicio-social-detail-dialog.component.scss']
})
export class ServicioSocialDetailDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() servicio: ServicioSocial | null = null;
}
