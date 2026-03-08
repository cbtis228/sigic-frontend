import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorDetail'
})
export class ErrorDetailPipe implements PipeTransform {

  transform(error: any, fieldName: string = ''): string {
    if (!error) return '';

    // Si es un string, procesar directamente
    if (typeof error === 'string') {
      return this.processErrorMessage(error, fieldName);
    }

    // Si es un array de errores
    if (Array.isArray(error)) {
      return this.handleArrayError(error, fieldName);
    }

    // Si es un objeto de errores
    if (typeof error === 'object') {
      return this.handleObjectError(error, fieldName);
    }

    return 'Error desconocido';
  }

  private handleArrayError(error: any[], fieldName: string): string {
    if (error.length === 0) return '';

    // Tomar el primer error del array
    const firstError = error[0];

    if (typeof firstError === 'string') {
      return this.processErrorMessage(firstError, fieldName);
    }

    if (typeof firstError === 'object') {
      return this.handleObjectError(firstError, fieldName);
    }

    return 'Error de validación';
  }

  private handleObjectError(error: any, fieldName: string): string {
    // Manejar estructura típica de Django REST Framework
    if (error.detail) {
      return this.processErrorMessage(error.detail, fieldName);
    }

    // Manejar errores de campo específico
    if (fieldName && error[fieldName]) {
      const fieldError = error[fieldName];

      if (Array.isArray(fieldError)) {
        return this.handleArrayError(fieldError, fieldName);
      }

      if (typeof fieldError === 'string') {
        return this.processErrorMessage(fieldError, fieldName);
      }

      if (typeof fieldError === 'object') {
        return this.handleObjectError(fieldError, fieldName);
      }
    }

    // Manejar errores no field-specific
    const keys = Object.keys(error);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const firstError = error[firstKey];

      if (Array.isArray(firstError)) {
        return this.handleArrayError(firstError, firstKey);
      }

      if (typeof firstError === 'string') {
        return this.processErrorMessage(firstError, firstKey);
      }
    }

    return 'Error de validación';
  }

  private processErrorMessage(errorMessage: string, fieldName: string): string {
    // Detectar errores de "already exists" y formatearlos
    if (errorMessage.toLowerCase().includes('already exists')) {
      return this.formatAlreadyExistsError(errorMessage, fieldName);
    }

    // Personalizar mensajes comunes
    const customMessages: { [key: string]: string } = {
      'email': 'El formato del correo electrónico no es válido',
      'required': 'Este campo es requerido',
      'min_length': 'El valor es demasiado corto',
      'max_length': 'El valor es demasiado largo',
      'unique': 'Este valor ya existe',
      'invalid': 'El valor no es válido',
    };

    // Buscar mensaje personalizado
    for (const [key, message] of Object.entries(customMessages)) {
      if (errorMessage.toLowerCase().includes(key)) {
        return fieldName ? `${this.formatFieldName(fieldName)}: ${message}` : message;
      }
    }

    // Mensaje genérico con el nombre del campo
    if (fieldName) {
      return `${this.formatFieldName(fieldName)}: ${errorMessage}`;
    }

    return errorMessage;
  }

  private formatAlreadyExistsError(errorMessage: string, fieldName: string): string {
    // Extraer el nombre del modelo si está presente
    const modelMatch = errorMessage.match(/(\w+) with this/);
    const modelName = modelMatch ? this.formatModelName(modelMatch[1]) : 'El registro';

    // Extraer el nombre del campo si está presente
    const fieldMatch = errorMessage.match(/this (\w+) already/);
    const extractedFieldName = fieldMatch ? fieldMatch[1] : fieldName;

    const formattedFieldName = this.formatFieldName(extractedFieldName);

    return `${modelName} con este ${formattedFieldName} ya existe`;
  }

  private formatFieldName(fieldName: string): string {
    const fieldMap: { [key: string]: string } = {
      'email': 'Correo electrónico',
      'password': 'Contraseña',
      'username': 'Usuario',
      'first_name': 'Nombre',
      'last_name': 'Apellido',
      'correo': 'Correo electrónico',
      'nombre': 'Nombre',
      'apellido': 'Apellido',
      'telefono': 'Teléfono',
      'direccion': 'Dirección',
      'ciudad': 'Ciudad',
      'numero_control': 'Número de control',
      'matricula': 'Matrícula',
      'cedula': 'Cédula',
      'rfc': 'RFC',
      'curp': 'CURP',
      'docente': 'Docente',
      'profesor': 'Profesor',
      'alumno': 'Alumno',
      'estudiante': 'Estudiante',
      'materia': 'Materia',
      'curso': 'Curso',
      'clave': 'Clave',
      'codigo': 'Código',
    };

    return fieldMap[fieldName] || fieldName;
  }

  private formatModelName(modelName: string): string {
    const modelMap: { [key: string]: string } = {
      'alumno': 'Alumno',
      'docente': 'Docente',
      'profesor': 'Profesor',
      'estudiante': 'Estudiante',
      'usuario': 'Usuario',
      'user': 'Usuario',
      'materia': 'Materia',
      'curso': 'Curso',
      'clase': 'Clase',
      'grupo': 'Grupo',
    };

    return modelMap[modelName.toLowerCase()] || modelName;
  }
}
