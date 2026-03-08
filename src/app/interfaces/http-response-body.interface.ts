import { MetaDataInterface } from "./metadata.interface";

export interface HttpResponseBody<T = unknown> {
  data?: T;
  meta: MetaDataInterface;
}