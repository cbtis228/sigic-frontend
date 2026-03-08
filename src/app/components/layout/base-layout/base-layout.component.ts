import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TopnavLayoutComponent } from '../topnav-layout/topnav-layout.component';
import { MenuLayoutComponent } from '../menu-layout/menu-layout.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { LoadingService } from '../../../services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-base-layout',
  imports: [
    CommonModule,
    TopnavLayoutComponent,
    MenuLayoutComponent,
    RouterOutlet,
    ProgressSpinnerModule,
  ],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
  animations: [
    trigger('shrinkGrow', [
      state(
        'collapsed',
        style({
          width: 'calc(100% - 4rem)',
        })
      ),
      state(
        'expanded',
        style({
          width: 'calc(100% - 14rem)',
        })
      ),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class BaseLayoutComponent {
  @ViewChild(MenuLayoutComponent, { read: ElementRef })
  menu?: ElementRef;

  constructor(
    public menuService: MenuService,
    public loading: LoadingService
  ) {}

  getAnimationState() {
    return this.menuService.isDesktop()
      ? this.menuService.currentDesktopMenuState
      : 'no-animation';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.menuService.isDesktop()) return;

    if (this.menuService.currentMobileMenuState == 'hidden') return;

    const clickedInsideMenu = this.menu?.nativeElement.contains(event.target);

    if (!clickedInsideMenu) {
      this.menuService.hideMobileMenu();
    }
  }
}
