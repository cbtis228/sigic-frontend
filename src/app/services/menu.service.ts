import { Injectable } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { PERMISSIONS_KEY } from '../global.constants';

type CustomMegaMenuItem = MegaMenuItem & {
  root: boolean;
  config?: boolean;
  customItems?: CustomMegaMenuItem[];
  expanded?: boolean; // Added for template compatibility if used elsewhere
};

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private mobileMenuState = new BehaviorSubject<'visible' | 'hidden'>('hidden');
  mobileMenuState$ = this.mobileMenuState.asObservable();
  private desktopMenuState = new BehaviorSubject<'collapsed' | 'expanded'>(
    'collapsed',
  );
  desktopMenuState$ = this.desktopMenuState.asObservable();
  menuItems: CustomMegaMenuItem[] = [];

  constructor(private storage: StorageService) {}

  // --- State Management ---
  isDesktop(): boolean {
    return window.innerWidth > 1024;
  }

  get currentMobileMenuState(): 'visible' | 'hidden' {
    return this.mobileMenuState.value;
  }

  hideMobileMenu() {
    if (!this.isDesktop()) this.mobileMenuState.next('hidden');
  }

  showMobileMenu() {
    if (!this.isDesktop()) this.mobileMenuState.next('visible');
  }

  toggleMobileMenu() {
    if (!this.isDesktop()) {
      this.mobileMenuState.next(
        this.currentMobileMenuState === 'visible' ? 'hidden' : 'visible',
      );
    }
  }

  get currentDesktopMenuState(): 'expanded' | 'collapsed' {
    return this.desktopMenuState.value;
  }

  collapseDesktopMenu() {
    if (this.isDesktop()) this.desktopMenuState.next('collapsed');
  }

  expandDesktopMenu() {
    if (this.isDesktop()) this.desktopMenuState.next('expanded');
  }

  toggleDesktopMenu() {
    if (this.isDesktop()) {
      this.desktopMenuState.next(
        this.currentDesktopMenuState === 'expanded' ? 'collapsed' : 'expanded',
      );
    }
  }

  // --- Permission Helper ---
  hasPermission(permission: string, permissionList: string[]): boolean {
    return permissionList.some((p) => p === permission);
  }

  // --- Menu Generation Helpers ---
  private createMenuItem(label: string, icon: string, routerLink?: string): CustomMegaMenuItem {
    return {
      label,
      icon,
      root: true,
      config: true,
      routerLink, // If undefined, template treats it as a menu trigger
      items: [[]],
      customItems: [],
    };
  }

  private createSubItem(label: string, routerLink: string, icon: string): CustomMegaMenuItem {
    return {
      label,
      icon,
      root: false,
      routerLink,
      items: [[]],
      customItems: [],
    };
  }

  async generateMenuItems() {
    this.menuItems = [];
    const grantedPermissions = (await this.storage.retrieveData(PERMISSIONS_KEY)) as string[];
    const role = await this.storage.retrieveData('role');

    if (role === 'alumno') {
      this.buildAlumnoMenu();
    } else if (role === 'docente') {
      this.buildDocenteMenu(grantedPermissions);
    }
  }

  private buildAlumnoMenu() {
    // 1. Inicio
    this.menuItems.push(this.createMenuItem('Inicio', 'pi pi-home', '/alumno/'));

    // 2. Horario
    this.menuItems.push(this.createMenuItem('Horario', 'pi pi-calendar-clock', 'horario/'));

    // 3. Histórico (Academic History)
    const historicoMenu = this.createMenuItem('Histórico', 'pi pi-history');
    historicoMenu.customItems!.push(this.createSubItem('Notas', 'historical/notes', 'pi pi-file'));
    historicoMenu.customItems!.push(this.createSubItem('Servicio Social', 'historical/servicio-social', 'pi pi-users'));
    this.menuItems.push(historicoMenu);

    // 4. General (Personal Data)
    const generalMenu = this.createMenuItem('General', 'pi pi-user');
    generalMenu.customItems!.push(this.createSubItem('Mis Datos', '/alumno/data/general', 'pi pi-user'));
    generalMenu.customItems!.push(this.createSubItem('Contactos De Emergencia', '/alumno/data/contactos-emergencia', 'pi pi-heart'));
    generalMenu.customItems!.push(this.createSubItem('Facturacion', '/alumno/data/datos-facturacion', 'pi pi-dollar'));
    this.menuItems.push(generalMenu);
  }

  private buildDocenteMenu(permissions: string[]) {
    // 1. Inicio
    this.menuItems.push(this.createMenuItem('Inicio', 'pi pi-home', '/docente/'));

    // 2. Académico (Grouping: Subjects, Schedules, Assignments, Social Service, Incidents)
    const academicoMenu = this.createMenuItem('Académico', 'pi pi-book');
    
    // My Subjects (Always visible based on original code)
    academicoMenu.customItems!.push(this.createSubItem('Mis Materias', 'personal/materias', 'pi pi-address-book'));
    
    if (this.hasPermission('academico.view_inscripcion', permissions)) {
      academicoMenu.customItems!.push(this.createSubItem('Inscripciones', '/docente/inscripciones', 'pi pi-list'));
    }
    if (this.hasPermission('academico.view_horario', permissions)) {
      academicoMenu.customItems!.push(this.createSubItem('Horarios', '/docente/horarios', 'pi pi-calendar-clock'));
    }
    if (this.hasPermission('academico.view_asignaciondocente', permissions)) {
      academicoMenu.customItems!.push(this.createSubItem('Asignación Docente', '/docente/asignacion-docente', 'pi pi-users'));
    }
    if (this.hasPermission('academico.view_serviciosocial', permissions)) {
      academicoMenu.customItems!.push(this.createSubItem('Servicio Social', '/docente/servicio-social', 'pi pi-briefcase'));
    }
    if (this.hasPermission('academico.view_incidencia', permissions)) {
      academicoMenu.customItems!.push(this.createSubItem('Incidencias', '/docente/incidencias', 'pi pi-exclamation-circle'));
    }

    if (academicoMenu.customItems!.length > 0) {
      this.menuItems.push(academicoMenu);
    }

    // 3. Alumnos (Grouping: Student List, Attendance)
    const alumnosMenu = this.createMenuItem('Alumnos', 'pi pi-users');
    
    if (this.hasPermission('alumnos.view_alumno', permissions)) {
      alumnosMenu.customItems!.push(this.createSubItem('Listado de Alumnos', '/docente/alumnos', 'pi pi-book'));
    }
    if (this.hasPermission('academico.view_asistencia', permissions)) {
      alumnosMenu.customItems!.push(this.createSubItem('Asistencia', '/docente/asistencias', 'pi pi-clock'));
    }

    if (alumnosMenu.customItems!.length > 0) {
      this.menuItems.push(alumnosMenu);
    }

    const inventarioMenu = this.createMenuItem('Inventario', 'pi pi-building-columns');
    if (this.hasPermission('inventario.view_ubicacion', permissions)) {
      inventarioMenu.customItems!.push(this.createSubItem('Ubicaciones', '/docente/inventarios/ubicaciones', 'pi pi-building-columns'));
    }
    this.menuItems.push(inventarioMenu)

    // 4. Reportes
    const reportesMenu = this.createMenuItem('Reportes', 'pi pi-chart-line');
    reportesMenu.customItems!.push(this.createSubItem('Académicos', '/docente/reportes/academicos', 'pi pi-chart-line'));
    this.menuItems.push(reportesMenu);

    // 5. Administrar (Grouping: Config, Inventory, Cycles, etc.)
    const administrarMenu = this.createMenuItem('Administrar', 'pi pi-cog');

    if (this.hasPermission('docentes.view_docente', permissions)) {
      administrarMenu.customItems!.push(this.createSubItem('Docentes', '/docente/manage/docentes', 'pi pi-user'));
    }
    if (this.hasPermission('academico.view_cicloescolar', permissions)) {
      administrarMenu.customItems!.push(this.createSubItem('Ciclos Escolares', '/docente/manage/ciclos-escolares', 'pi pi-calendar'));
    }
    if (this.hasPermission('academico.view_grupo', permissions)) {
      administrarMenu.customItems!.push(this.createSubItem('Grupos', '/docente/manage/grupos', 'pi pi-users'));
    }
    if (this.hasPermission('academico.view_salon', permissions)) {
      administrarMenu.customItems!.push(this.createSubItem('Salones', '/docente/manage/salones', 'pi pi-building'));
    }
    if (this.hasPermission('academico.view_materia', permissions)) {
      administrarMenu.customItems!.push(this.createSubItem('Materias', '/docente/manage/materias', 'pi pi-book'));
    }
    if (this.hasPermission('academico.view_planestudio', permissions)) {
      administrarMenu.customItems!.push(this.createSubItem('Planes Estudio', '/docente/manage/planes-estudio', 'pi pi-th-large'));
    }
    if (this.hasPermission('core.view_configuracion', permissions)) {
      administrarMenu.customItems!.push(this.createSubItem('Configuración De Institución', '/docente/manage/configuracion', 'pi pi-cog'));
    }
    // Merged Inventario here

    if (administrarMenu.customItems!.length > 0) {
      this.menuItems.push(administrarMenu);
    }

    // 6. Mi Perfil (Grouping: Personal Data, Personal Schedule)
    const perfilMenu = this.createMenuItem('Mi Perfil', 'pi pi-user');
    perfilMenu.customItems!.push(this.createSubItem('Mis Datos', '/docente/data/general', 'pi pi-user'));
    perfilMenu.customItems!.push(this.createSubItem('Mi Horario', 'personal/horario', 'pi pi-calendar-clock'));
    this.menuItems.push(perfilMenu);

    // 7. Descargas
    this.menuItems.push(this.createMenuItem('Descargas', 'pi pi-download', '/docente/downloads'));
  }

  async getMenuItems(): Promise<MegaMenuItem[]> {
    await this.generateMenuItems();
    return this.menuItems.map((item) => ({
      ...item,
      items: item.customItems?.map((subItem) => [subItem]) || [],
    }));
  }
}
