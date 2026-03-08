import { computed, effect, Injectable, Output, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';

export interface themeConfigInterface {
  preset?: string;
  primary?: string;
  primaryHex?: string;
  surface?: string | undefined | null;
  darkTheme?: boolean;
}

export interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

export interface Document {
  startViewTransition?: (callback: () => Promise<void> | void) => ViewTransition;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  _config: themeConfigInterface = {
    preset: 'Aura',
    primary: 'emerald',
    primaryHex: '#34d399',
    surface: null,
    darkTheme: false
  };
  themeConfig = signal<themeConfigInterface>(this._config);

  private themeUpdate = new Subject<themeConfigInterface>();

  themeUpdate$ = this.themeUpdate.asObservable();

  theme = computed(() => (this.themeConfig()?.darkTheme ? false : true));
  isDarkTheme = computed(() => this.themeConfig().darkTheme);
  getPrimary = computed(() => this.themeConfig().primary);
  getPrimaryHex = computed(() => this.themeConfig().primaryHex);
  getSurface = computed(() => this.themeConfig().surface);
  transitionComplete = signal<boolean>(false);

  private initialized = false;

  constructor(
    private storage: StorageService
  ) {
    this.themeConfig.set(this.storage.getThemeConfig());
    this.toggleDarkMode(this.storage.getThemeConfig());
    effect(() => {
      const config = this.themeConfig();
      if (config) {
        this.onConfigUpdate();
      }
    });

    effect(() => {
      const config = this.themeConfig();

      if (!this.initialized || !config) {
        this.initialized = true;
        return;
      }

      this.handleDarkModeTransition(config);
    });
  }

  private handleDarkModeTransition(config: themeConfigInterface): void {
    if ((document as Document).startViewTransition) {
      this.startViewTransition(config);
    } else {
      this.toggleDarkMode(config);
      this.onTransitionEnd();
    }
  }

  private startViewTransition(config: themeConfigInterface): void {
    const transition = (document as Document).startViewTransition!(() => {
      this.toggleDarkMode(config);
    });
  
    transition.ready
      .then(() => {
        this.onTransitionEnd();
      })
      .catch(() => {
        // Optional error handling
      });
  }

  changeDarkMode() {
    this.themeConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  initTheme() {
    this.themeUpdate.next(this.storage.getThemeConfig());
    this.themeConfig.update((state) => ({ ...state }));
  }

  toggleDarkMode(config?: themeConfigInterface): void {
    const element = document.querySelector('html');
    const _config = config || this.themeConfig();
    if (_config.darkTheme) {
      element!.classList.add('dark');
    } else {
      element!.classList.remove('dark');
    }
  }

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  onConfigUpdate() {
    this._config = { ...this.themeConfig() };
    this.themeUpdate.next(this.themeConfig());
    this.storage.setThemeConfig(this.themeConfig());
  }

}
