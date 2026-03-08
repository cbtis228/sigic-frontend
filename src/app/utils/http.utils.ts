import { HttpParams } from '@angular/common/http';

/**
 * Función genérica para formatear filtros antes de enviarlos al API
 * @param filters Objeto de filtros a formatear
 * @param initialParams Parámetros HTTP iniciales (opcional)
 * @returns HttpParams con los filtros formateados
 */
export function formatFilters<T extends Record<string, any>>(
  filters: T,
  initialParams: HttpParams = new HttpParams(),
): HttpParams {
  let params = initialParams;

  if (!filters) {
    return params;
  }

  for (const key of Object.keys(filters) as Array<keyof T>) {
    const value = filters[key];

    if (value === undefined || value === null) {
      continue;
    }

    if (key === 'global_filter' && typeof value === 'string') {
      params = params.set(key as string, value);
      continue;
    }

    if (Array.isArray(value)) {
      const formattedArray = value.map((v: any) => {
        if (v.value instanceof Date) {
          return { ...v, value: v.value.toISOString().split('T')[0] };
        }
        return v;
      });

      params = params.set(key as string, JSON.stringify(formattedArray));
      continue;
    }

    if ((value as any) instanceof Date) {
      params = params.set(key as string, value.toISOString().split('T')[0]);
    } else if (typeof value === 'object') {
      params = params.set(key as string, JSON.stringify(value));
    } else {
      params = params.set(key as string, value.toString());
    }
  }

  return params;
}
