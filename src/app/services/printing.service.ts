import { Injectable } from '@angular/core';
import { ThemeService } from './theme.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  constructor(
    private theme: ThemeService,
    private storage: StorageService
  ) {

  }

}

const centavosFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const filterNum = (str: string): string => {
  const numericalChar = new Set([".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  return str.split("").filter(char => numericalChar.has(char)).join("");
};

function numeroALetras(cantidad: string | number): string {
  let numero: string = "";
  cantidad = filterNum(cantidad.toString());
  cantidad = parseFloat(cantidad);

  if (cantidad === 0 || cantidad === 0.00) {
    return "CERO PESOS CON 00/100 M.N.";
  } else {
    const ent: string[] = cantidad.toString().split(".");
    const arreglo: string[] = separar_split(ent[0]);
    const longitud: number = arreglo.length;

    switch (longitud) {
      case 1:
        numero = unidades(parseInt(arreglo[0]));
        break;
      case 2:
        numero = decenas(parseInt(arreglo[0]), parseInt(arreglo[1]));
        break;
      case 3:
        numero = centenas(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]));
        break;
      case 4:
        numero = unidadesdemillar(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]));
        break;
      case 5:
        numero = decenasdemillar(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]));
        break;
      case 6:
        numero = centenasdemillar(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]));
        break;
      case 7:
        numero = unidadesdemillon(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]), parseInt(arreglo[6]));
        break;
      case 8:
        numero = decenasdemillon(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]), parseInt(arreglo[6]), parseInt(arreglo[7]));
        break;
      case 9:
        numero = centenasdemillon(parseInt(arreglo[0]), parseInt(arreglo[1]), parseInt(arreglo[2]), parseInt(arreglo[3]), parseInt(arreglo[4]), parseInt(arreglo[5]), parseInt(arreglo[6]), parseInt(arreglo[7]), parseInt(arreglo[8]));
        break;
      default:
        numero = "_____________________________________________________________________ ";
        break;
    }

    const formattedEnt: string[] = centavosFormatter.format(cantidad).toString().split(".");
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

function unidades(unidad: number): string {
  const unidades: string[] = ['UN ', 'DOS ', 'TRES ', 'CUATRO ', 'CINCO ', 'SEIS ', 'SIETE ', 'OCHO ', 'NUEVE '];
  return unidades[unidad - 1];
}

function decenas(decena: number, unidad: number): string {
  const diez: string[] = ['ONCE ', 'DOCE ', 'TRECE ', 'CATORCE ', 'QUINCE ', 'DIECISEIS ', 'DIECISIETE ', 'DIECIOCHO ', 'DIECINUEVE '];
  const decenas: string[] = ['DIEZ ', 'VEINTE ', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];

  if (decena === 0 && unidad === 0) {
    return "";
  }

  if (decena === 0 && unidad > 0) {
    return unidades(unidad);
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
      return `VEINTI${unidades(unidad)}`;
    }
  } else {
    if (unidad === 0) {
      return `${decenas[decena - 1]} `;
    }
    if (unidad === 1) {
      return `${decenas[decena - 1]} Y UN `;
    }
    return `${decenas[decena - 1]} Y ${unidades(unidad)}`;
  }
}

function centenas(centena: number, decena: number, unidad: number): string {
  const centenas: string[] = ["CIENTO ", "DOSCIENTOS ", "TRESCIENTOS ", "CUATROCIENTOS ", "QUINIENTOS ", "SEISCIENTOS ", "SETECIENTOS ", "OCHOCIENTOS ", "NOVECIENTOS "];

  if (centena === 0 && decena === 0 && unidad === 0) {
    return "";
  }
  if (centena === 1 && decena === 0 && unidad === 0) {
    return "CIEN ";
  }

  if (centena === 0 && decena === 0 && unidad > 0) {
    return unidades(unidad);
  }

  if (decena === 0 && unidad === 0) {
    return centenas[centena - 1];
  }

  if (decena === 0) {
    return `${centenas[centena - 1]}${decenas(decena, unidad)}`.replace(" Y ", " ");
  }
  if (centena === 0) {
    return decenas(decena, unidad);
  }

  return `${centenas[centena - 1]}${decenas(decena, unidad)}`;
}

function unidadesdemillar(unimill: number, centena: number, decena: number, unidad: number): string {
  let numero: string = `${unidades(unimill)}MIL ${centenas(centena, decena, unidad)}`;
  numero = numero.replace("UN MIL ", "MIL ");
  return unidad === 0 ? numero.replace(" Y ", " ") : numero;
}

function decenasdemillar(decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
  return `${decenas(decemill, unimill)}MIL ${centenas(centena, decena, unidad)}`;
}

function centenasdemillar(centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
  return `${centenas(centenamill, decemill, unimill)}MIL ${centenas(centena, decena, unidad)}`;
}

function unidadesdemillon(unimillon: number, centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
  let centenasDeMillar: string = centenasdemillar(centenamill, decemill, unimill, centena, decena, unidad);
  if (centenasDeMillar === "MIL ") centenasDeMillar = "DE ";
  let numero: string = unimillon === 1 ? `${unidades(unimillon)}MILLON ${centenasDeMillar}` : `${unidades(unimillon)}MILLONES ${centenasDeMillar}`;
  return unidad === 0 ? numero.replace(" Y ", " ") : numero;
}

function decenasdemillon(decemillon: number, unimillon: number, centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
  let centenasDeMillar: string = centenasdemillar(centenamill, decemill, unimill, centena, decena, unidad);
  if (centenasDeMillar === "MIL ") centenasDeMillar = "DE ";
  return `${decenas(decemillon, unimillon)}MILLONES ${centenasDeMillar}`;
}

function centenasdemillon(centenamillon: number, decemillon: number, unimillon: number, centenamill: number, decemill: number, unimill: number, centena: number, decena: number, unidad: number): string {
  let centenasDeMillar: string = centenasdemillar(centenamill, decemill, unimill, centena, decena, unidad);
  if (centenasDeMillar === "MIL ") centenasDeMillar = "DE ";
  return `${centenas(centenamillon, decemillon, unimillon)}MILLONES ${centenasDeMillar}`;
}

function separar_split(texto: string): string[] {
  return texto.split("");
}
