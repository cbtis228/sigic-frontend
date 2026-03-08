import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function endDateAfterStartDateValidator(
  startDateFieldName: string = 'start_date',
  endDateFieldName: string = 'end_date'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as any;

    const startDate = formGroup.get(startDateFieldName)?.value;
    const endDate = formGroup.get(endDateFieldName)?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Clear time part for accurate day comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      return {
        endDateBeforeStartDate: {
          message: 'End date must be after start date',
          startDate,
          endDate
        }
      };
    }

    return null;
  };
}
