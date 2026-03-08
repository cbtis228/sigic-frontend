import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { $t, updatePreset, updateSurfacePalette } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';
import { PrimeNG } from 'primeng/config';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ThemeService } from '../../services/theme.service';
import { StyleClassModule } from 'primeng/styleclass';
import { SurfacesType } from '../../types/surface.type';
import { CONST_SURFACES } from '../../consts/theme.constants';

const presets = {
  Aura,
  Lara,
  Nora
} as const;

declare type KeyOfType<T> = keyof T extends infer U ? U : never;

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule, StyleClassModule],
  template: `
    <div class="flex flex-col gap-4">
      <div>
        <span class="text-sm text-muted-color font-semibold">Tema</span>
        <div class="pt-2 flex gap-2 flex-wrap justify-start">
          @for (primaryColor of primaryColors(); track primaryColor.name) {
            <button
              type="button"
              [title]="primaryColor.name"
              (click)="updateColors($event, 'primary', primaryColor)"
              [ngClass]="{ 'outline-primary': primaryColor.name === selectedPrimaryColor() }"
              class="border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1"
              [style]="{
                  'background-color': primaryColor?.name === 'noir' ? 'var(--text-color)' : primaryColor?.palette?.['500']
              }"
            ></button>
          }
        </div>
      </div>
      <div>
        <span class="text-sm text-muted-color font-semibold">Fondos</span>
        <div class="pt-2 flex gap-2 flex-wrap justify-start">
          @for (surface of surfaces; track surface.name) {
            <button
              type="button"
              [title]="surface.name"
              (click)="updateColors($event, 'surface', surface)"
              [ngClass]="{ 'outline-primary': selectedSurfaceColor() ? selectedSurfaceColor() === surface.name : themeService.themeConfig().darkTheme ? surface.name === 'zinc' : surface.name === 'slate' }"
              class="border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1"
              [style]="{
                'background-color': surface?.name === 'noir' ? 'var(--text-color)' : surface?.palette?.['500']
              }"
            ></button>
          }
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-muted-color font-semibold">Plantilla</span>
        <p-selectbutton [options]="presets" [ngModel]="selectedPreset()" (ngModelChange)="onPresetChange($event)" [allowEmpty]="false" size="small" />
      </div>
    </div>
    `,
  host: {
    class: 'hidden absolute top-[3.25rem] right-0 w-72 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]',
    id: 'configurator'
  }
})
export class AppConfigurator {
  router = inject(Router);

  config: PrimeNG = inject(PrimeNG);

  themeService: ThemeService = inject(ThemeService);

  platformId = inject(PLATFORM_ID);

  primeng = inject(PrimeNG);

  presets = Object.keys(presets);

  private wasInside = false;

  isVisible: boolean = false

  surfaces = CONST_SURFACES

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside && this.isVisible) {
      this.hideComponent()
    }
    this.wasInside = false
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.onPresetChange(this.themeService.themeConfig().preset!);
    }
  }

  showComponent() {
    setTimeout(() => {
      this.isVisible = true
      document.getElementById('configurator')?.classList.remove('hidden')
    }, 0);
  }

  hideComponent() {
    this.isVisible = false
    document.getElementById('configurator')?.classList.add('hidden')
  }


  selectedPrimaryColor = computed(() => {
    return this.themeService.themeConfig().primary;
  });

  selectedSurfaceColor = computed(() => this.themeService.themeConfig().surface);

  selectedPreset = computed(() => this.themeService.themeConfig().preset);

  primaryColors = computed<SurfacesType[]>(() => {
    const presetPalette = presets[this.themeService.themeConfig().preset as KeyOfType<typeof presets>].primitive;
    const colors = ['emerald', 'green', 'lime', 'orange', 'amber', 'yellow', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
    const palettes: SurfacesType[] = [{ name: 'noir', palette: {}, hex: '#000000'}];

    colors.forEach((color) => {
      palettes.push({
        name: color,
        hex: color==='noir' ? '#000000' : (presetPalette?.[color as KeyOfType<typeof presetPalette>] as SurfacesType['palette'])?.['600'],
        palette: presetPalette?.[color as KeyOfType<typeof presetPalette>] as SurfacesType['palette']
      });
    });

    return palettes;
  });

  getPresetExt() {
    const color: SurfacesType = this.primaryColors().find((c) => c.name === this.selectedPrimaryColor()) || {};
    const preset = this.themeService.themeConfig().preset;

    if (color.name === 'noir') {
      return {
        semantic: {
          primary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}'
          },
          colorScheme: {
            light: {
              primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.800}',
                activeColor: '{primary.700}'
              },
              highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff'
              }
            },
            dark: {
              primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.200}',
                activeColor: '{primary.300}'
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}'
              }
            }
          }
        }
      };
    } else {
      if (preset === 'Nora') {
        return {
          semantic: {
            primary: color.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.600}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.700}',
                  activeColor: '{primary.800}'
                },
                highlight: {
                  background: '{primary.600}',
                  focusBackground: '{primary.700}',
                  color: '#ffffff',
                  focusColor: '#ffffff'
                }
              },
              dark: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.400}',
                  activeColor: '{primary.300}'
                },
                highlight: {
                  background: '{primary.500}',
                  focusBackground: '{primary.400}',
                  color: '{surface.900}',
                  focusColor: '{surface.900}'
                }
              }
            }
          }
        };
      } else {
        return {
          semantic: {
            primary: color.palette,
            colorScheme: {
              light: {
                primary: {
                  color: '{primary.500}',
                  contrastColor: '#ffffff',
                  hoverColor: '{primary.600}',
                  activeColor: '{primary.700}'
                },
                highlight: {
                  background: '{primary.50}',
                  focusBackground: '{primary.100}',
                  color: '{primary.700}',
                  focusColor: '{primary.800}'
                }
              },
              dark: {
                primary: {
                  color: '{primary.400}',
                  contrastColor: '{surface.900}',
                  hoverColor: '{primary.300}',
                  activeColor: '{primary.200}'
                },
                highlight: {
                  background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                  focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                  color: 'rgba(255,255,255,.87)',
                  focusColor: 'rgba(255,255,255,.87)'
                }
              }
            }
          }
        };
      }
    }
  }

  updateColors(event: Event, type: string, color: SurfacesType) {
    if (type === 'primary') {
      this.themeService.themeConfig.update((state) => ({ ...state, primary: color.name, primaryHex: color.hex }));
    } else if (type === 'surface') {
      this.themeService.themeConfig.update((state) => ({ ...state, surface: color.name, primaryHex: color.hex }));
    }
    this.applyTheme(type, color);

    event.stopPropagation();
  }

  applyTheme(type: string, color: SurfacesType) {
    if (type === 'primary') {
      updatePreset(this.getPresetExt());
    } else if (type === 'surface') {
      updateSurfacePalette(color.palette);
    }
  }

  onPresetChange(event: string) {
    this.themeService.themeConfig.update((state) => ({ ...state, preset: event }));
    const preset = presets[event as KeyOfType<typeof presets>];
    const surfacePalette = this.surfaces.find((s) => s.name === this.selectedSurfaceColor())?.palette;
    $t().preset(preset).preset(this.getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
  }

}
