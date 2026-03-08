import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Form, FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { SelectOptionsInterface } from '../../../interfaces/select-options.interface';
import { ValidadoresService } from '../../../services/validadores.service';


@Component({
  selector: 'app-custom-select',
  imports: [
    CommonModule,
    SelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent {

  @Input() control: FormFieldInterface = { name: '', label: '', type: '' };
  @Input() fieldLabel: string = '';
  @Input() form!: FormGroup;
  @Input() viewMode: boolean = false;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() classList: string = '';

  @Input() options: SelectOptionsInterface[] = []
  @Input() initialValue?: unknown

  constructor(
    public validadoresService: ValidadoresService
  ) {

  }

  ngOnInit(){
    if(this.initialValue !== undefined){
      this.form.get(this.control.name)?.setValue(this.initialValue);
      if(this.readonly){
        this.form.get(this.control.name)?.disable()
      }
    }
  }


}
