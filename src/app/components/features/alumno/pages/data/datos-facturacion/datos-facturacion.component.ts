import { Component } from '@angular/core';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { DatosFacturacion } from '../../../../../../interfaces/alumno.interface';
import { ButtonModule } from 'primeng/button';
import { DatosFacturacionCardComponent } from '../../../components/datos-facturacion-card/datos-facturacion-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-datos-facturacion',
  imports: [ButtonModule, DatosFacturacionCardComponent, RouterModule],
  templateUrl: './datos-facturacion.component.html',
  styleUrl: './datos-facturacion.component.scss',
})
export class DatosFacturacionComponent {
  datosFacturacion: DatosFacturacion | null = null;

  constructor(private alumnoService: AlumnosService) {}

  ngOnInit(): void {
    this.alumnoService.DatosFacturacionSelfDetailApi().subscribe({
      next: (response) => {
        this.datosFacturacion = response;
      },
    });
  }
}
