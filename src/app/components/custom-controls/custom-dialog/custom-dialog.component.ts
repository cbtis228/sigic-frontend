import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DialogModule} from 'primeng/dialog'
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { CustomFormComponent } from '../custom-form/custom-form.component';
import { FormGroup, FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-dialog',
  imports: [
    TranslateModule,
    CustomFormComponent,
    CommonModule,
    FormsModule,
    DialogModule
  ],
  templateUrl: './custom-dialog.component.html',
  styleUrl: './custom-dialog.component.scss'
})
export class CustomDialogComponent {

  @Input() title:string = '';
  @Input() visible: boolean = false;
  @Input() inputFields: FormFieldInterface[] = [];
  @Input() gridCols: string = '3';
  @Input() form!: FormGroup;
  @Input() submitLabel: string = '';
  @Input() cancelLabel: string = '';
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmit: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onCancel: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    private translate: TranslateService
  ) {
  }

  returnSubmit() {
    this.onSubmit.emit()
  }

  returnCancel(){
    this.onCancel.emit()
  }
  

}
