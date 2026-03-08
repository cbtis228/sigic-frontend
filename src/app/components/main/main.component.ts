import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { BaseLayoutComponent } from '../layout/base-layout/base-layout.component';
import { LoginComponent } from '../sesion/login/login.component';
import { Toast } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppConfigurator } from '../layout/app.configurator';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    BaseLayoutComponent,
    LoginComponent,
    Toast,
    ProgressSpinnerModule,
  ],
  providers: [AppConfigurator],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  loading$: Observable<boolean>;

  constructor(
    public storage: StorageService,
    public loading: LoadingService,
    private ruta: ActivatedRoute,
    private title: Title,
    private change: ChangeDetectorRef,
    private test: AppConfigurator,
    private themeService: ThemeService,
    private router: Router,
  ) {
    this.test.onPresetChange(this.themeService.themeConfig().preset!);
    this.loading$ = this.loading.loading$;
  }
}
