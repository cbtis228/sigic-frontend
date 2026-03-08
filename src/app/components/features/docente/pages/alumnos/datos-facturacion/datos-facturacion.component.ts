import { Component } from '@angular/core';
import { DatosFacturacion } from '../../../../../../interfaces/alumno.interface';
import { AlumnosService } from '../../../../../../services/alumnos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatosFacturacionCardComponent } from '../../../../alumno/components/datos-facturacion-card/datos-facturacion-card.component';
import { PermissionsService } from '../../../../../../services/permissions.service';

@Component({
  selector: 'app-datos-facturacion',
  imports: [
    CommonModule,
    ButtonModule,
    DatosFacturacionCardComponent,
    RouterModule,
  ],
  templateUrl: './datos-facturacion.component.html',
  styleUrl: './datos-facturacion.component.scss',
})
export class DatosFacturacionComponent {
  datosFacturacion: DatosFacturacion | null = null;

  constructor(
    private alumnoService: AlumnosService,
    private route: ActivatedRoute,
    public permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    const numero_control = this.route.parent?.snapshot.paramMap.get('id');
    if (!numero_control) return;
    forkJoin([
      this.alumnoService.DatosFacturacionFromAlumnoApi(numero_control),
    ]).subscribe(([datosFacturaion]) => {
      this.datosFacturacion = datosFacturaion;
    });
  }
}
