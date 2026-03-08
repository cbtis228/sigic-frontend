import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpResponseBody } from '../interfaces/http-response-body.interface';
import { BASE_HEADERS, CONST_CONFIG } from '../global.constants';
import { GeneralConfigInterface } from '../interfaces/general-config.interface';
import { ConfigDbInterface } from '../interfaces/config-db.interface';
import { StorageService } from './storage.service';

const AUTH_API = environment.apiUrl + 'config'


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private http: HttpClient,
    private storage:StorageService
  ) { }

  private appConfigSubject = new BehaviorSubject({} as GeneralConfigInterface);
  appConfigSubject$ = this.appConfigSubject.asObservable();

  emitConfigChange(change: GeneralConfigInterface) {
    this.appConfigSubject.next(change);
  }

  get appConfigValue(): GeneralConfigInterface {
    return this.appConfigSubject.value;
  }
  getAllNoFile(): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'true', 'showLoading': 'true' })
    };
    return this.http.get<HttpResponseBody>(AUTH_API + '/allNoFile', headers).pipe(
      tap((res: HttpResponseBody) => {
        this.appConfigSubject.next(res.data as GeneralConfigInterface);
        this.storage.storeData(CONST_CONFIG.STORED_ORGANIZATION_DATA, res.data);
      })
    );
  }

  saveAllNoFile(data: ConfigDbInterface[]): Observable<HttpResponseBody> {
    const headers = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'true', 'showLoading': 'true', 'showSuccesfulResponse': 'true' })
    };
    return this.http.post<HttpResponseBody>(AUTH_API + '/allNoFile', data, headers);
  }

  // Observable string sources
  private emitChangeLogo = new Subject<boolean>();
  // Observable string streams
  logoChangedEmited$ = this.emitChangeLogo.asObservable();
  // Service message commands
  emitLogoChange(change: boolean) {
    this.emitChangeLogo.next(change);
  }

  storeLogoAsBase64String(logoBlob: Blob): Observable<string> {
    const reader = new FileReader();
    const observable = new Observable<string>((observer) => {
      reader.addEventListener("loadend", (e) => {
        observer.next(reader.result as string);
        observer.complete();
      });
      reader.readAsDataURL(logoBlob);
    });
    return observable;
  }

  /*
  getFile(fileName: string): Observable<Blob> {
    const options = {
      headers: new HttpHeaders({ ...BASE_HEADERS, 'skipAuth': 'true', 'showLoading': 'false' })
    };
    return this.http.get(AUTH_API + '/file/' + fileName, { headers: options.headers, responseType: 'blob' });
  } */

  uploadFile(file: File, fileName: string): Observable<HttpResponseBody> {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      headers: new HttpHeaders({ 'skipAuth': 'false', 'showLoading': 'true', 'showSuccesfulResponse': 'true' })
    };
    return this.http.post<HttpResponseBody>(AUTH_API + '/upload/' + fileName, formData, options);
  }

}
