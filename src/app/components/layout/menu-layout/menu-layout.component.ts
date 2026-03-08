import { CommonModule } from '@angular/common';
import { Component, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenuModule } from 'primeng/megamenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuService } from '../../../services/menu.service';
import { ButtonModule } from 'primeng/button';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-layout',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    RouterLink,
    RouterModule,
    MegaMenuModule,
    TieredMenuModule,
  ],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.scss',
  animations: [
    trigger('slideInOut', [
      state(
        'visible',
        style({
          transform: 'translateX(0)',
          width: '14rem',
        }),
      ),
      state(
        'hidden',
        style({
          transform: 'translateX(-16rem)',
        }),
      ),
      transition('visible => hidden', animate('300ms ease-in-out')),
      transition('hidden => visible', animate('300ms ease-in-out')),
    ]),
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          width: '4rem',
        }),
      ),
      state(
        'expanded',
        style({
          width: '14rem',
        }),
      ),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class MenuLayoutComponent {
  menuItems: MegaMenuItem[] = [];
  animationDelay = 300;
  expandedStates: Record<string, boolean> = {};
  mobileMenuState: 'visible' | 'hidden' = 'hidden';
  desktopMenuState: 'expanded' | 'collapsed' = 'collapsed';

  constructor(
    public menuService: MenuService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.menuItems = await this.menuService.getMenuItems();
    window.addEventListener('resize', () => this.handleResize());
    this.menuService.mobileMenuState$.subscribe((state) => {
      this.mobileMenuState = state;
      if (state === 'hidden') {
        this.closeAllCategories();
      }
    });
    this.menuService.desktopMenuState$.subscribe((state) => {
      this.desktopMenuState = state;
      if (state === 'collapsed') {
        this.closeAllCategories();
      }
    });
  }

  toggleSubmenu(item: any) {
    item.expanded = !item.expanded;
  }

  getMobileMenuState(): 'visible' | 'hidden' {
    return this.menuService.currentMobileMenuState;
  }

  getDesktopMenuState(): 'expanded' | 'collapsed' {
    return this.menuService.currentDesktopMenuState;
  }

  isMenuVisible(): boolean {
    if (this.menuService.isDesktop()) {
      return true;
    } else {
      return this.mobileMenuState === 'visible';
    }
  }

  toggleExpand(label: string) {
    this.expandedStates[label] = !this.expandedStates[label];
  }

  isExpanded(label: string): boolean {
    return !!this.expandedStates[label];
  }

  handleResize() {
    if (!this.menuService.isDesktop()) {
      this.menuService.hideMobileMenu();
    }
  }

  showLabelMenu(): boolean {
    return (
      (this.menuService.isDesktop() && this.desktopMenuState === 'expanded') ||
      !this.menuService.isDesktop()
    );
  }

  onMenuItemClick(item: any) {
    if (!item.customItems?.length) {
      return;
    }

    if (!this.showLabelMenu()) {
      this.menuService.toggleDesktopMenu();

      setTimeout(() => {
        this.toggleCategory(item);
      }, this.animationDelay);
    } else {
      this.toggleCategory(item);
    }
  }

  toggleCategory(item: any) {
    item.expanded = !item.expanded;
  }

  onChildClick() {
    if (this.menuService.isDesktop()) {
      this.menuService.toggleDesktopMenu();
    } else {
      this.menuService.toggleMobileMenu();
    }
  }

  closeAllCategories() {
    this.menuItems.forEach((item: any) => {
      item.expanded = false;
    });
  }

  @Output() isDesktopMenuExpanded(): boolean {
    return (
      this.getDesktopMenuState() === 'expanded' && this.menuService.isDesktop()
    );
  }
}
