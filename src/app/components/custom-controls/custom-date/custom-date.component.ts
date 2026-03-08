import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { ValidadoresService } from '../../../services/validadores.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-custom-date',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule
  ],
  templateUrl: './custom-date.component.html',
  styleUrl: './custom-date.component.scss'
})
export class CustomDateComponent {

  @Input() control: FormFieldInterface = { name: '', label: '', type: '' };
  @Input() fieldLabel: string = '';
  @Input() form!: FormGroup;
  @Input() viewMode: boolean = false;
  @Input() required: boolean = false;
  @Input() initialValue?: unknown;
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

  ngOnInit():void{
    if(this.initialValue !== undefined){
      this.form.get(this.control.name)?.setValue(this.initialValue as Date);
    }else{
      this.form.get(this.control.name)?.setValue(new Date());
    }
  }

}
