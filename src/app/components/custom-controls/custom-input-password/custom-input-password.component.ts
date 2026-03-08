import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { ValidadoresService } from '../../../services/validadores.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-custom-input-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule
  ],
  templateUrl: './custom-input-password.component.html',
  styleUrl: './custom-input-password.component.scss'
})
export class CustomInputPasswordComponent {

  @Input() control: FormFieldInterface = { name: '', label: '', type: '' };
  @Input() fieldLabel: string = '';
  @Input() form!: FormGroup;
  @Input() viewMode: boolean = false;
  @Input() required: boolean = false;
  @Input() classList: string = '';

  @Output() onBlur: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onFocus: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onChange: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onInput: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onKeyDown: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onPaste: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onDrop: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    public validadoresService: ValidadoresService
  ) {

  }

}
