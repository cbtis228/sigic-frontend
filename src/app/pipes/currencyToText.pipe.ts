import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyToText',
  standalone:true
})
export class CurrencyToTextPipe implements PipeTransform {
  transform(value: string | number): string {
    return this.numeroALetras(value);
  }

  centavosFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  filterNum = (str: string): string => {
    const numericalChar = new Set([".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    return str.split("").filter(char => numericalChar.has(char)).join("");
  };
  
  numeroALetras(cantidad: string | number): string {
    let numero: string = "";
    cantidad = this.filterNum(cantidad.toString());
    cantidad = parseFloat(cantidad);
  
    if (cantidad === 0 || cantidad === 0.00) {
      return "CERO PESOS CON 00/100 M.N.";
    } else {
      const ent: string[] = cantidad.toString().split(".");
      const arreglo: string[] = this.separar_split(ent[0]);
      const longitud: number = arreglo.length;
  
      switch (longitud) {
        case 1:
          numero = this.unidades(parseInt(arreglo[0]));
          break;
        case 2:
          numero = this.decenas(parseInt(arreglo[0]), parseInt(arreglo[1]));
          break;
        case 3:
          numero = this.centenas(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]));
          break;
        case 4:
          numero = this.unidadesdemillar(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]));
          break;
        case 5:
          numero = this.decenasdemillar(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]));
          break;
        case 6:
          numero = this.centenasdemillar(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]));
          break;
        case 7:
          numero = this.unidadesdemillon(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]), parseInt(arreglo[6]));
          break;
        case 8:
          numero = this.decenasdemillon(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]), parseInt(arreglo[6]), parseInt(arreglo[7]));
          break;
        case 9:
          numero = this.centenasdemillon(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]), parseInt(arreglo[6]), parseInt(arreglo[7]), parseInt(arreglo[8]));
          break;
        default:
          numero = "_____________________________________________________________________ ";
          break;
      }
  
      const formattedEnt: string[] = this.centavosFormatter.format(cantidad).toString().split(".");
      const centavos: string = isNaN(parseInt(formattedEnt[1])) ? '00' : formattedEnt[1];
  
      if (numero === 'UN ') {
        return `UN PESO CON ${centavos}/100 M.N.`;
      }
      if (numero === 'UN MIL') {
        return `MIL PESOS CON ${centavos}/100 M.N.`;
      }
  
      return `${numero}PESOS CON ${centavos}/100 M.N.`;
    }
  }
  
  unidades(unidad: number): string {
    const unidades: string[] = ['UN ', 'DOS ', 'TRES ', 'CUATRO ', 'CINCO ', 'SEIS ', 'SIETE ', 'OCHO ', 'NUEVE '];
    return unidades[unidad - 1];
  }
  
  decenas(decena: number, unidad: number): string {
    const diez: string[] = ['ONCE ', 'DOCE ', 'TRECE ', 'CATORCE ', 'QUINCE ', 'DIECISEIS ', 'DIECISIETE ', 'DIECIOCHO ', 'DIECINUEVE '];
    const decenas: string[] = ['DIEZ ', 'VEINTE ', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  
    if (decena === 0 && unidad === 0) {
      return "";
    }
  
    if (decena === 0 && unidad > 0) {
      return this.unidades(unidad);
    }
  
    if (decena === 1) {
      if (unidad === 0) {
        return decenas[decena - 1];
      } else {
        return diez[unidad - 1];
      }
    } else if (decena === 2) {
      if (unidad === 0) {
        return decenas[decena - 1];
      } else if (unidad === 1) {
        return "VEINTIUN ";
      } else {
        return `VEINTI${this.unidades(unidad)}`;
      }
    } else {
      if (unidad === 0) {
        return `${decenas[decena - 1]} `;
      }
      if (unidad === 1) {
        return `${decenas[decena - 1]} Y UN `;
      }
      return `${decenas[decena - 1]} Y ${this.unidades(unidad)}`;
    }
  }
  
  centenas(centena: number, decena: number, unidad: number): string {
    const centenas: string[] = ["CIENTO ", "DOSCIENTOS ", "TRESCIENTOS ", "CUATROCIENTOS ", "QUINIENTOS ", "SEISCIENTOS ", "SETECIENTOS ", "OCHOCIENTOS ", "NOVECIENTOS "];
  
    if (centena === 0 && decena === 0 && unidad === 0) {
      return "";
    }
    if (centena === 1 && decena === 0 && unidad === 0) {
      return "CIEN ";
    }
  
    if (centena === 0 && decena === 0 && unidad > 0) {
      return this.unidades(unidad);
    }
  
    if (decena === 0 && unidad === 0) {
      return centenas[centena - 1];
    }
  
    if (decena === 0) {
      return `${centenas[centena - 1]}${this.decenas(decena, unidad)}`.replace(" Y ", " ");
    }
    if (centena === 0) {
      return this.decenas(decena, unidad);
    }
  
    return `${centenas[centena - 1]}${this.decenas(decena, unidad)}`;
  }
  
  unidadesdemillar(unimill: number, centena: number, decena: number, unidad: number): string {
    let numero: string = `${this.unidades(unimill)}MIL ${this.centenas(centena, decena, unidad)}`;
    numero = numero.replace("UN MIL ", "MIL ");
    return unidad === 0 ? numero.replace(" Y ", " ") : numero;
  }
  
  decenasdemillar(decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
    return `${this.decenas(decemill, unimill)}MIL ${this.centenas(centena, decena, unidad)}`;
  }
  
  centenasdemillar(centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
    return `${this.centenas(centenamill, decemill, unimill)}MIL ${this.centenas(centena, decena, unidad)}`;
  }
  
  unidadesdemillon(unimillon: number, centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
    let centenasDeMillar: string = this.centenasdemillar(centenamill, decemill, unimill, centena, decena, unidad);
    if (centenasDeMillar === "MIL ") centenasDeMillar = "DE ";
    let numero: string = unimillon === 1 ? `${this.unidades(unimillon)}MILLON ${centenasDeMillar}` : `${this.unidades(unimillon)}MILLONES ${centenasDeMillar}`;
    return unidad === 0 ? numero.replace(" Y ", " ") : numero;
  }
  
  decenasdemillon(decemillon: number, unimillon: number, centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
    let centenasDeMillar: string = this.centenasdemillar(centenamill, decemill, unimill, centena, decena, unidad);
    if (centenasDeMillar === "MIL ") centenasDeMillar = "DE ";
    return `${this.decenas(decemillon, unimillon)}MILLONES ${centenasDeMillar}`;
  }
  
  centenasdemillon(centenamillon: number, decemillon: number, unimillon: number, centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
    let centenasDeMillar: string = this.centenasdemillar(centenamill, decemill, unimill, centena, decena, unidad);
    if (centenasDeMillar === "MIL ") centenasDeMillar = "DE ";
    return `${this.centenas(centenamillon, decemillon, unimillon)}MILLONES ${centenasDeMillar}`;
  }
  
  separar_split(texto: string): string[] {
    return texto.split("");
  }
}