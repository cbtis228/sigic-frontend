import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomInputTextComponent } from '../custom-input-text/custom-input-text.component';
import { ButtonModule } from 'primeng/button';
import { CustomInputPasswordComponent } from '../custom-input-password/custom-input-password.component';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CustomDateComponent } from "../custom-date/custom-date.component";
import { CustomInputNumberComponent } from "../custom-input-number/custom-input-number.component";
import { CustomInputAutocompleteComponent } from '../custom-input-autocomplete/custom-input-autocomplete.component';
import { CustomTextareaComponent } from '../custom-textarea/custom-textarea.component';
import { MessageService } from 'primeng/api';
import { CONST_ALERTA_ERROR } from '../../../global.constants';

@Component({
  selector: 'app-custom-form',
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    CustomInputTextComponent,
    CustomInputPasswordComponent,
    CustomSelectComponent,
    CustomDateComponent,
    CustomInputNumberComponent,
    CustomInputAutocompleteComponent,
    CustomTextareaComponent
],
  templateUrl: './custom-form.component.html',
  styleUrl: './custom-form.component.scss'
})
export class CustomFormComponent {

  @Input() inputFields: FormFieldInterface[] = [];
  @Input() form!: FormGroup
  @Input() viewMode: boolean = false
  @Input() showTitle: boolean = false
  @Input() showViewToggle: boolean = false
  @Input() title:string = ''
  @Input() submitLabel: string = ''
  @Input() cancelLabel: string = ''
  @Input() showSubmit: boolean = true
  @Input() showCancel: boolean = true
  @Input() gridCols: string = '3'

  @Output() onBlur: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onFocus: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onChange: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onInput: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onKeyDown: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onPaste: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onDrop: EventEmitter<Event> = new EventEmitter<Event>();

  @Output() onSubmit: EventEmitter<Event> = new EventEmitter<Event>()
  @Output() onReset: EventEmitter<Event> = new EventEmitter<Event>()
  @Output() onCancel: EventEmitter<Event> = new EventEmitter<Event>()

  constructor(
    private translate: TranslateService,
    private messageService: MessageService
  ){

  }

  toggleViewMode() {
    this.viewMode = !this.viewMode
  }

  submitForm(event: Event) {
    if(this.form.invalid){
      this.messageService.add({ ...CONST_ALERTA_ERROR, detail: this.translate.instant('errors.invalid-form') })
      this.form.markAllAsTouched()
      return;
    }
    this.onSubmit.emit()
  }
  cancel(){
    this.onCancel.emit()
  }

}
