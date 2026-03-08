import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardWithTitleComponent } from '../../../../../../shared/card-with-title/card-with-title.component';
import { AcademicoService } from '../../../../../../../services/academico.service';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TIPO_SALON } from '../../../../../../../global.constants';
import { InputNumberModule } from 'primeng/inputnumber';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardWithTitleComponent,
    SelectModule,
    DatePickerModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    CalendarModule,
  ],

  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  tipos = TIPO_SALON;

  constructor(
    private fb: FormBuilder,
    private academicoService: AcademicoService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: [''],
      capacidad: [null],
      tipo: [1, [Validators.required]],
    });

    this.fillFakeData()
  }

  fillFakeData(): void {
    const fakeSalon = {
      nombre: faker.company.name(),
      ubicacion: faker.location.streetAddress(),
      capacidad: faker.number.int({ min: 10, max: 200 }),
      tipo: faker.helpers.arrayElement([1, 2, 3]), // depende de tu enum TIPO_SALON
    };

    this.form.patchValue(fakeSalon);
  }

  onSalonSave(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    this.academicoService.SalonCreateApi(formValue).subscribe({
      next: () => {
        this.messageService.add({
          detail: 'Salon creado exitosamente',
          severity: 'success',
        });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (error) => {
        const detail =
          error.error.detail || 'Ocurrió un error al crear el ciclo escolar';
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }
}
