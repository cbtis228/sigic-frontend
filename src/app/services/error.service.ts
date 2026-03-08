import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  // Método principal que detecta automáticamente el campo
  formatError(error: any): string {
    if (!error) return 'Error desconocido';

    // Si es un HttpErrorResponse, extraer el error
    if (error instanceof HttpErrorResponse) {
      return this.formatError(error.error);
    }

    // Si es un objeto con estructura { detail: { campo: [error] } }
    if (
      error.detail &&
      typeof error.detail === 'object' &&
      !Array.isArray(error.detail)
    ) {
      return this.handleDetailObject(error.detail);
    }

    if (typeof error.detail === 'object' && !Array.isArray(error.detail)) {
      return this.handleFieldErrors(error);
    }

    // Si es un string directo
    if (typeof error.detail === 'string') {
      return this.processErrorMessage(error);
    }

    // Si es un array
    if (Array.isArray(error.detail)) {
      return this.handleArrayError(error.detail);
    }

    if (typeof error === 'object') {
      return error;
    }

    return 'Error de validación';
  }

  // Manejar objeto con estructura { campo: [error] }
  private handleFieldErrors(errorObj: any): string {
    const fields = Object.keys(errorObj);

    if (fields.length === 0) return 'Error de validación';

    const firstField = fields[0];
    const fieldError = errorObj[firstField];

    if (Array.isArray(fieldError) && fieldError.length > 0) {
      return this.processErrorMessage(fieldError[0], firstField);
    }

    if (typeof fieldError === 'string') {
      return this.processErrorMessage(fieldError, firstField);
    }

    if (typeof fieldError === 'object') {
      return this.handleFieldErrors(fieldError);
    }

    return 'Error de validación';
  }

  // Manejar estructura { detail: { campo: [error] } }
  private handleDetailObject(detailObj: any): string {
    if (typeof detailObj === 'string') {
      return this.processErrorMessage(detailObj);
    }

    if (typeof detailObj === 'object' && !Array.isArray(detailObj)) {
      return this.handleFieldErrors(detailObj);
    }

    return 'Error de validación';
  }

  private handleArrayError(errorArray: any[]): string {
    if (errorArray.length === 0) return 'Error de validación';

    const firstError = errorArray[0];

    if (typeof firstError === 'string') {
      return this.processErrorMessage(firstError);
    }

    if (typeof firstError === 'object') {
      return this.formatError(firstError);
    }

    return 'Error de validación';
  }

  private processErrorMessage(
    errorMessage: string,
    fieldName: string = '',
  ): string {
    // Detectar errores de "already exists" y formatearlos
    if (errorMessage.toLowerCase().includes('already exists')) {
      return this.formatAlreadyExistsError(errorMessage, fieldName);
    }

    // Personalizar mensajes comunes
    const customMessages: { [key: string]: string } = {
      email: 'El formato del correo electrónico no es válido',
      required: 'Este campo es requerido',
      min_length: 'El valor es demasiado corto',
      max_length: 'El valor es demasiado largo',
      unique: 'Este valor ya existe',
      invalid: 'El valor no es válido o no existe',
      blank: 'Este campo no puede estar vacío',
      null: 'Este campo es requerido',
    };

    // Buscar mensaje personalizado
    for (const [key, message] of Object.entries(customMessages)) {
      if (errorMessage.toLowerCase().includes(key)) {
        return fieldName
          ? `${this.formatFieldName(fieldName)}: ${message}`
          : message;
      }
    }

    if (fieldName) {
      return `${this.formatFieldName(fieldName)}: ${errorMessage}`;
    }

    return errorMessage;
  }

  private formatAlreadyExistsError(
    errorMessage: string,
    fieldName: string,
  ): string {
    // Extraer el nombre del modelo si está presente
    const modelMatch = errorMessage.match(/(\w+) with this/);
    const modelName = modelMatch
      ? this.formatModelName(modelMatch[1])
      : 'El registro';

    // Si no tenemos fieldName, intentar extraerlo del mensaje
    let extractedFieldName = fieldName;
    if (!extractedFieldName) {
      const fieldMatch = errorMessage.match(/this (\w+) already/);
      extractedFieldName = fieldMatch ? fieldMatch[1] : '';
    }

    const formattedFieldName = extractedFieldName
      ? this.formatFieldName(extractedFieldName)
      : 'campo';
    if (formattedFieldName === '__all__') return errorMessage;

    return `${modelName} con este ${formattedFieldName} ya existe`;
  }

  private formatFieldName(fieldName: string): string {
    const fieldMap: { [key: string]: string } = {
      email: 'Correo electrónico',
      inscripciones_data: 'Inscripciones masivas',
      password: 'Contraseña',
      username: 'Usuario',
      first_name: 'Nombre',
      last_name: 'Apellido',
      capacidad_maxima: 'Capacidad maxima',
      periodo: 'Periodo',
      correo: 'Correo electrónico',
      nombre: 'Nombre',
      apellido: 'Apellido',
      telefono: 'Teléfono',
      grupo: 'Grupo',
      direccion: 'Dirección',
      ciudad: 'Ciudad',
      numero_control: 'Número de control',
      matricula: 'Matrícula',
      cedula: 'Cédula',
      rfc: 'RFC',
      curp: 'CURP',
      docente: 'Docente',
      profesor: 'Profesor',
      alumno: 'Alumno',
      estudiante: 'Estudiante',
      materia: 'Materia',
      curso: 'Curso',
      clave: 'Clave',
      codigo: 'Código',
    };

    return fieldMap[fieldName] || fieldName;
  }

  private formatModelName(modelName: string): string {
    const modelMap: { [key: string]: string } = {
      alumno: 'Alumno',
      docente: 'Docente',
      profesor: 'Profesor',
      estudiante: 'Estudiante',
      usuario: 'Usuario',
      user: 'Usuario',
      materia: 'Materia',
      curso: 'Curso',
      clase: 'Clase',
      grupo: 'Grupo',
      persona: 'Persona',
      empleado: 'Empleado',
    };

    return modelMap[modelName.toLowerCase()] || modelName;
  }

  // Método para obtener todos los errores (útil para forms)
  getAllErrors(error: any): { field: string; message: string }[] {
    if (!error) return [];

    const errors: { field: string; message: string }[] = [];

    // Si es HttpErrorResponse
    if (error instanceof HttpErrorResponse) {
      return this.getAllErrors(error.error);
    }

    // Si tiene estructura { detail: { campo: [error] } }
    if (error.detail && typeof error.detail === 'object') {
      return this.extractFieldErrors(error.detail);
    }

    // Si es objeto directo con errores { campo: [error] }
    if (typeof error === 'object' && !Array.isArray(error)) {
      return this.extractFieldErrors(error);
    }

    return errors;
  }

  private extractFieldErrors(
    errorObj: any,
  ): { field: string; message: string }[] {
    const errors: { field: string; message: string }[] = [];
    const fields = Object.keys(errorObj);

    for (const field of fields) {
      const fieldErrors = errorObj[field];

      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((errorMessage) => {
          if (typeof errorMessage === 'string') {
            errors.push({
              field: this.formatFieldName(field),
              message: this.processErrorMessage(errorMessage, field),
            });
          }
        });
      } else if (typeof fieldErrors === 'string') {
        errors.push({
          field: this.formatFieldName(field),
          message: this.processErrorMessage(fieldErrors, field),
        });
      }
    }

    return errors;
  }
}
