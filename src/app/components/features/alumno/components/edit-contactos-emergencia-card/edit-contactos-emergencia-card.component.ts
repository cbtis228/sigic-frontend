import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardWithTitleComponent } from '../../../../shared/card-with-title/card-with-title.component';
import { AlumnosService } from '../../../../../services/alumnos.service';
import { ContactoEmergencia, ContactoEmergenciaUpdate } from '../../../../../interfaces/alumno.interface';

@Component({
  selector: 'app-edit-contactos-emergencia-alumno-card',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    CardWithTitleComponent,
    RouterModule,
  ],
  templateUrl: './edit-contactos-emergencia-card.component.html',
  styleUrl: './edit-contactos-emergencia-card.component.scss',
})
export class EditContactosEmergenciaCardComponent implements OnChanges {
  contactosForm!: FormGroup;
  @Input() contactosList!: ContactoEmergencia[]
  @Input() showSkeletons: boolean = true;
  @Output() updatedContactos: EventEmitter<ContactoEmergenciaUpdate[]> =
    new EventEmitter<ContactoEmergenciaUpdate[]>();


  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnosService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.contactosForm = this.fb.group({
      contactos: this.fb.array([
        this.crearContactoForm(),
        this.crearContactoForm(),
        this.crearContactoForm(),
      ]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactosList'] && this.contactosList) {
      this.contactosForm.get("contactos")!.patchValue(this.contactosList);
    }
  }

  get contactos(): FormArray {
    return this.contactosForm.get('contactos') as FormArray;
  }

  crearContactoForm(): FormGroup {
    return this.fb.group({
      id: [null, Validators.required],
      nombre_completo: [''],
      parentesco: [''],
      celular: [''],
      telefono: [''],
      telefono_trabajo: [''],
      correo_electronico: [''],
    });
  }

  onSubmit(): void {
    const updatedContactos = this.contactosForm.getRawValue().contactos as ContactoEmergenciaUpdate[];
    this.updatedContactos.emit(updatedContactos);
  }
}
