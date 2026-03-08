import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ViewChild } from '@angular/core';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../../services/theme.service';
import { StorageService } from '../../../services/storage.service';
import { MenuService } from '../../../services/menu.service';
import { RouterLink, RouterModule } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../../../services/config.service';
import { CONST_CONFIG } from '../../../global.constants';
import { AppConfigurator } from '../app.configurator';
import { Router } from '@angular/router';
import { forkJoin, from, map, pipe } from 'rxjs';

@Component({
  selector: 'app-topnav-layout',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SplitButtonModule,
    MenuModule,
    AppConfigurator,
  ],
  templateUrl: './topnav-layout.component.html',
  styleUrl: './topnav-layout.component.scss',
})
export class TopnavLayoutComponent {
  @ViewChild('userMenu') userMenu: Menu | undefined;
  @ViewChild('templateMenu') templateMenu!: AppConfigurator;

  themeIcon: string = 'pi pi-moon';
  themeLabel: string = 'Tema Oscuro';

  logo: SafeUrl = '';
  title: String = 'SiCOC';

  @ViewChild('settingsMenu') settingsMenu!: Menu;

  settingsMenuItems: MenuItem[] = [];

  fullName: string = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private themeService: ThemeService,
    private storage: StorageService,
    private menuService: MenuService,
    private configService: ConfigService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initializeMenu();
  }

  private initializeMenu() {
    this.settingsMenuItems = this.createMenuItems();
    forkJoin([
      from(this.storage.retrieveData('paterno') as Promise<string>),
      from(this.storage.retrieveData('materno') as Promise<string>),
      from(this.storage.retrieveData('nombres') as Promise<string>),
    ]).subscribe({
      next: ([paterno, materno, nombres]) => {
        this.fullName = `${nombres} ${paterno} ${materno}`;
      },
      error: (err) => console.error('Error in nav:', err),
    });
  }

  private createMenuItems(): MenuItem[] {
    return [
      /* {
        label: 'Perfil',
        id:'profile',
        icon: 'pi pi-user',

       }, */
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => this.storage.logOut(),
      },
    ];
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuService.toggleMobileMenu();
  }
}
