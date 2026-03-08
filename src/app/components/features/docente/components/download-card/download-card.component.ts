import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-download-card',
  imports: [ButtonModule, CommonModule],
  templateUrl: './download-card.component.html',
  styleUrl: './download-card.component.scss',
})
export class DownloadCardComponent {
  @Output() onClickDownloadCsv: EventEmitter<any> = new EventEmitter();
  @Input() title!: string;
  @Input() description!: string;
  @Input() bulletPoints: string[] = [];
  @Input() showCsvButton = false;
}
