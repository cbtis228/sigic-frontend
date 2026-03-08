import { Component } from '@angular/core';
import { ContactoEmergenciaCardComponent } from '../../../components/contacto-emergencia-card/contacto-emergencia-card.component';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { ContactoEmergencia } from '../../../../../../interfaces/alumno.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contactos-emergencia',
  imports: [ContactoEmergenciaCardComponent, CommonModule, ButtonModule, RouterModule],
  templateUrl: './contactos-emergencia.component.html',
  styleUrl: './contactos-emergencia.component.scss'
})
export class ContactosEmergenciaComponent {

  contactosEmergencia: ContactoEmergencia[] | null = null

  constructor(private alumnoService: AlumnosService){}

  ngOnInit() : void {
    this.alumnoService.ContactoEmergenciaSelfListApi().subscribe({
      next: (response) => {
        this.contactosEmergencia = response
      }
    })
  }

}
