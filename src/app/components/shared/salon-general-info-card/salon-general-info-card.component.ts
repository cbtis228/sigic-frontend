import { Component, Input } from '@angular/core';
import { Salon } from '../../../interfaces/academico.interface';
import { CardWithTitleComponent } from '../card-with-title/card-with-title.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salon-general-info-card',
  imports: [CardWithTitleComponent, CommonModule],
  templateUrl: './salon-general-info-card.component.html',
  styleUrl: './salon-general-info-card.component.scss'
})
export class SalonGeneralInfoCardComponent {
  @Input() salon: Salon | null = null;
  @Input() loading: boolean = true;
}
