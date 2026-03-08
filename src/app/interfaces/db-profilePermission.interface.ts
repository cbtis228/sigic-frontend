import { DbPermissionInterface } from "./db-permission.interface"
import { DbProfileInterface } from "./db-profile.interface"

export interface DbProfilePermissionInterface{
  profile_permission_id?:number
  profile_id?:number
  permission_id?:number
  profile?:DbProfileInterface
  permission?:DbPermissionInterface
  granted?:number
  isGranted?:boolean
  status?:number
  created_at?:Date
  updated_at?:Date
  deleted_at?:Date
}