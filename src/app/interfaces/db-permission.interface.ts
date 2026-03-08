export interface DbPermissionInterface{
  permission_id?:number;
  name?:string;
  module?:string;
  description?:string;
  status?:number;
  created_at?:Date;
  updated_at?:Date;
  deleted_at?:Date;
}