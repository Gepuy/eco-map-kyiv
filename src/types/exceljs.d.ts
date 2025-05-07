
declare module 'exceljs' {
  export class Workbook {
    xlsx: {
      writeBuffer(): Promise<Buffer>;
    };
    csv: {
      writeBuffer(): Promise<Buffer>;
    };
    addWorksheet(name: string): Worksheet;
    getWorksheet(name: string): Worksheet;
  }

  export interface Worksheet {
    columns: Column[];
    getCell(address: string): Cell;
    getColumn(columnIndex: string | number): Column;
    getRow(rowIndex: number): Row;
    mergeCells(range: string): void;
    addRows(data: any[][]): void;
    eachRow(callback: (row: Row, rowNumber: number) => void): void;
    properties: WorksheetProperties;
  }

  export interface WorksheetProperties {
    defaultRowHeight: number;
    rowHeight: number;
    tabColor: string;
  }

  export interface Column {
    header: string;
    key: string;
    width: number;
    style?: any;
    hidden?: boolean;
  }

  export interface Cell {
    value: any;
    style: any;
    alignment: Alignment;
    border: Border;
    fill: Fill;
    font: Font;
    numFmt: string;
    merge?: number;
  }

  export interface Alignment {
    vertical?: 'top' | 'middle' | 'bottom';
    horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
    wrapText?: boolean;
    textRotation?: number;
    indent?: number;
    readingOrder?: 'rtl' | 'ltr';
  }

  export interface Border {
    top?: BorderLine;
    left?: BorderLine;
    bottom?: BorderLine;
    right?: BorderLine;
    diagonal?: BorderLine;
    diagonalUp?: boolean;
    diagonalDown?: boolean;
  }

  export interface BorderLine {
    style: 'thin' | 'dotted' | 'dashDot' | 'hair' | 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot' | 'medium' | 'double' | 'thick';
    color: { argb: string };
  }

  export interface Fill {
    type: 'pattern' | 'gradient';
    pattern?: 'none' | 'solid' | 'darkGray' | 'mediumGray' | 'lightGray' | 'gray125' | 'gray0625' | 'darkHorizontal' | 'darkVertical' | 'darkDown' | 'darkUp' | 'darkGrid' | 'darkTrellis' | 'lightHorizontal' | 'lightVertical' | 'lightDown' | 'lightUp' | 'lightGrid' | 'lightTrellis';
    fgColor?: { argb: string };
    bgColor?: { argb: string };
  }

  export interface Font {
    name: string;
    size: number;
    family: number;
    scheme: 'minor' | 'major' | 'none';
    charset: number;
    color: { argb: string };
    bold: boolean;
    italic: boolean;
    underline: boolean | 'none' | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';
    strike: boolean;
    outline: boolean;
  }

  export interface Row {
    getCell(colNumber: number): Cell;
    values: any[];
    height: number;
    hidden: boolean;
  }

  // Add default export
  const ExcelJS: {
    Workbook: typeof Workbook;
  };
  
  export default ExcelJS;
}
