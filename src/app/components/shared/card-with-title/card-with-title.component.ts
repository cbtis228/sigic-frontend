import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-with-title',
  imports: [CommonModule],
  templateUrl: './card-with-title.component.html',
  styleUrl: './card-with-title.component.scss',
})
export class CardWithTitleComponent {
  @Input() title: string = '';
  @Input() customClasses: string = '';
}
