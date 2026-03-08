import { inject } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { PERMISSIONS_KEY } from "../global.constants";

export const getGrantedPermissions = async ()=>{
  const storage = inject(StorageService)
  return await storage.retrieveData(PERMISSIONS_KEY)
}
