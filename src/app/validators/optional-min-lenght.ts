import { AbstractControl, ValidatorFn } from '@angular/forms';

export function optionalRequiredLengthValidator(min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // Si está vacío, null o undefined → VALIDO (no es required)
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // Si escribieron algo, validamos la longitud
    const stringValue = value.toString();
    return stringValue.length !== min
      ? {
          'minlength': {
            requiredLength: min,
            actualLength: stringValue.length,
            message: `Debe tener al menos ${min} caracteres`
          }
        }
      : null;
  };
}
