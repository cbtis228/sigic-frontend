import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from '../../../interfaces/file-manager.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-file-card',
  imports: [CommonModule, ButtonModule],
  templateUrl: './file-card.component.html',
  styleUrl: './file-card.component.scss'
})
export class FileCardComponent {
  @Input() file!: File
  @Input() showDownload: boolean | null = false
  @Input() showDelete: boolean | null = false
  @Output() onClickDownload: EventEmitter<File> = new EventEmitter()
  @Output() onClickDelete: EventEmitter<File> = new EventEmitter()
}
