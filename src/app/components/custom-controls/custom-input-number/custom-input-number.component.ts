import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { ValidadoresService } from '../../../services/validadores.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-custom-input-number',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule
  ],
  templateUrl: './custom-input-number.component.html',
  styleUrl: './custom-input-number.component.scss'
})
export class CustomInputNumberComponent {

  @Input() control: FormFieldInterface = { name: '', label: '', type: '' };
  @Input() fieldLabel: string = '';
  @Input() form!: FormGroup;
  @Input() viewMode: boolean = false;
  @Input() required: boolean = false;
  @Input() mode: string = '';
  @Input() currency: string = '';
  @Input() minFractionDigits: number = 0;
  @Input() maxFractionDigits: number = 0;
  @Input() classList: string = '';

  @Output() onBlur: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onFocusEmit: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onChange: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onInput: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onKeyDown: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onPaste: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onDrop: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    public validadoresService: ValidadoresService
  ) {

  }

  onFocus(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

}
