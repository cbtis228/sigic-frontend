import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom, map, Observable, take } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private _permissions = new BehaviorSubject<Record<string, boolean>>({});
  permissions = this._permissions.asObservable();

  constructor(private storage: StorageService) {
    this.loadPermissionsFromStorage();
  }

  private async loadPermissionsFromStorage() {
    const perms = await this.storage.retrieveData<string[]>('permissions');
    if (perms) {
      this.setPermissions(perms);
    }
  }

  private async waitUntilReady() {
    return firstValueFrom(
      this._permissions.pipe(
        filter(perms => Object.keys(perms).length > 0),
        take(1)
      )
    );
  }

  setPermissions(permissions: string[]) {
    const map: Record<string, boolean> = {};
    permissions.forEach((p) => (map[p] = true));
    this._permissions.next(map);
  }

  has$(permission: string) {
    return this.permissions.pipe(map((perms) => !!perms[permission]));
  }

  async validate(permission: string): Promise<boolean> {
    await this.waitUntilReady();
    return firstValueFrom(this.has$(permission));
  }

}

