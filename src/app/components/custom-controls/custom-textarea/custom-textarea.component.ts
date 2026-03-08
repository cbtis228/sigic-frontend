import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { ValidadoresService } from '../../../services/validadores.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {TextareaModule} from 'primeng/textarea'

@Component({
  selector: 'app-custom-textarea',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextareaModule
  ],
  templateUrl: './custom-textarea.component.html',
  styleUrl: './custom-textarea.component.scss'
})
export class CustomTextareaComponent {

  @Input() control: FormFieldInterface = { name: '', label: '', type: '' };
  @Input() fieldLabel: string = '';
  @Input() form!: FormGroup;
  @Input() viewMode: boolean = false;
  @Input() required: boolean = false;
  @Input() allowSpaces?: boolean = true;
  @Input() readonly?: boolean = false;
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

  ngOnInit() :void{
    if(this.allowSpaces===false && this.control.type === 'text' && !this.control.pattern){
      this.control.pattern = '^[a-zA-Z0-9]*$';
    }
  }

}
