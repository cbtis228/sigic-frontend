import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';
import { StorageService } from '../services/storage.service';
import { USER_KEY } from '../global.constants';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {

  const permissionsService = inject(PermissionsService)
  const storageService = inject(StorageService)
  const router = inject(Router);

  if(route.data['permission']){
    const userData = await storageService.retrieveData(USER_KEY)
    if(!userData){
      router.navigate([''])
    }
    const response = await firstValueFrom(
      permissionsService.isUserAllowed(
        (userData as {profile_id: number})['profile_id'],
        route.data['permission']
      )
    );
    return response.data!
  }else{
    return true;
  }
};
