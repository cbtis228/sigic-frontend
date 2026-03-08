import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-button.component.html',
  styleUrls: ['./card-button.component.scss'],
})
export class CardButtonComponent {
  @Input() label!: string;
  @Input() link!: string;
  @Input() loading: boolean = false;
  @Input() icon?: any;
}

