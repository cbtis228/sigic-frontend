import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const emailPattern = /@cbtis228\.edu\.mx$/i;

    const isValid = emailPattern.test(control.value);

    return isValid ? null : { emailFormat: { value: control.value } };
  };
}
