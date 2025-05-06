
import { saveAs } from 'file-saver';
import * as XLSX from 'exceljs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, TableLayoutType, BorderStyle } from 'docx';
import type { ProgramReport, MeasureCost } from '@/types/managementTypes';

// Функція для експорту у формат Excel
export const exportToExcel = async (data: any, fileName: string) => {
  const workbook = new XLSX.Workbook();
  const worksheet = workbook.addWorksheet('Data');
  
  if (Array.isArray(data)) {
    // Для масивів даних, використовуємо перший елемент для заголовків
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);
      
      // Додаємо дані
      data.forEach(item => {
        const values = headers.map(header => item[header]);
        worksheet.addRow(values);
      });
    }
  } else {
    // Для об'єктів, додаємо ключі та значення
    Object.entries(data).forEach(([key, value]) => {
      worksheet.addRow([key, value]);
    });
  }
  
  // Автоматична ширина стовпців
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 10;
      maxLength = Math.max(maxLength, cellLength);
    });
    column.width = maxLength + 2;
  });
  
  // Створюємо буфер та зберігаємо файл
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `${fileName}.xlsx`);
};

// Функція для експорту кошторису у Word
export const exportCostEstimateToWord = async (costData: MeasureCost[], title: string) => {
  // Створюємо новий документ
  const doc = new Document({
    title: title,
    description: 'Кошторис витрат на впровадження заходів',
    sections: [{
      children: [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: 'center',
        }),
        new Paragraph({ text: '' }),
        createCostEstimateTable(costData),
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Загальна вартість: ${formatCurrency(costData.reduce((sum, item) => sum + item.totalCost, 0))}`,
              bold: true,
              size: 28,
            }),
          ],
          alignment: 'right',
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Дата формування: ${new Date().toLocaleDateString('uk-UA')}`,
              size: 24,
            }),
          ],
          alignment: 'right',
        }),
      ],
    }],
  });

  // Зберігаємо файл
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `${title}.docx`);
};

// Функція для створення таблиці з даними про кошторис
const createCostEstimateTable = (costData: MeasureCost[]): Table => {
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
    },
    rows: [
      // Заголовок таблиці
      new TableRow({
        tableHeader: true,
        height: {
          value: 500,
        },
        children: [
          new TableCell({
            width: {
              size: 10,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: '№', alignment: 'center', bold: true })],
          }),
          new TableCell({
            width: {
              size: 40,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: 'Назва заходу', alignment: 'center', bold: true })],
          }),
          new TableCell({
            width: {
              size: 25,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: 'Ресурси', alignment: 'center', bold: true })],
          }),
          new TableCell({
            width: {
              size: 25,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: 'Вартість', alignment: 'center', bold: true })],
          }),
        ],
      }),
      // Додаємо рядки з даними
      ...costData.map((item, index) => createCostEstimateRow(item, index + 1)),
    ],
  });
  
  return table;
};

// Функція для створення рядка таблиці з даними про кошторис
const createCostEstimateRow = (item: MeasureCost, index: number): TableRow => {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ text: index.toString(), alignment: 'center' })],
      }),
      new TableCell({
        children: [new Paragraph({ text: item.name })],
      }),
      new TableCell({
        children: item.resources.map(resource => 
          new Paragraph({ 
            text: `${resource.name}: ${resource.quantity} од. (${formatCurrency(resource.unitPrice)} за од.)`,
          })
        ),
      }),
      new TableCell({
        children: [new Paragraph({ 
          text: formatCurrency(item.totalCost), 
          alignment: 'right',
          bold: true,
        })],
      }),
    ],
  });
};

// Функція для експорту програми розвитку у Word
export const exportRegionalProgramToWord = async (programReport: ProgramReport, title: string) => {
  // Створюємо новий документ
  const doc = new Document({
    title: title,
    description: 'Програма розвитку регіону',
    sections: [{
      children: [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: 'center',
        }),
        new Paragraph({
          text: programReport.program.name,
          heading: HeadingLevel.HEADING_2,
          alignment: 'center',
        }),
        new Paragraph({ text: '' }),
        
        new Paragraph({
          text: "Загальна інформація",
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: `Термін дії програми: ${formatDate(programReport.program.start_date)} - ${formatDate(programReport.program.end_date)}`,
        }),
        new Paragraph({
          text: `Загальний бюджет: ${formatCurrency(programReport.totalBudget)}`,
        }),
        new Paragraph({
          text: `Кількість заходів: ${programReport.measuresCount}`,
        }),
        new Paragraph({ text: '' }),
        
        new Paragraph({
          text: "Розподіл коштів за роками",
          heading: HeadingLevel.HEADING_3,
        }),
        ...programReport.years.map(year => new Paragraph({
          text: `${year} рік: ${formatCurrency(programReport.totalByYear[year])}`,
        })),
        new Paragraph({ text: '' }),
        
        new Paragraph({
          text: "Розподіл коштів за напрямками",
          heading: HeadingLevel.HEADING_3,
        }),
        ...programReport.categoriesDistribution.map(cat => new Paragraph({
          text: `${cat.categoryName}: ${formatCurrency(cat.funding)} (${cat.percentage.toFixed(1)}%)`,
        })),
        new Paragraph({ text: '' }),
        
        new Paragraph({
          text: "Заходи за роками",
          heading: HeadingLevel.HEADING_3,
        }),
        
        // Додаємо таблиці заходів по рокам
        ...programReport.years.flatMap(year => [
          new Paragraph({
            text: `${year} рік`,
            heading: HeadingLevel.HEADING_4,
          }),
          createYearMeasuresTable(programReport.measuresByYear[year], year),
          new Paragraph({ text: '' }),
        ]),
        
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Дата формування: ${new Date().toLocaleDateString('uk-UA')}`,
              size: 24,
            }),
          ],
          alignment: 'right',
        }),
      ],
    }],
  });

  // Зберігаємо файл
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `${title}.docx`);
};

// Функція для створення таблиці з заходами за рік
const createYearMeasuresTable = (measures: any[], year: number): Table => {
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '#000000' },
    },
    rows: [
      // Заголовок таблиці
      new TableRow({
        tableHeader: true,
        height: {
          value: 500,
        },
        children: [
          new TableCell({
            width: {
              size: 10,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: '№', alignment: 'center', bold: true })],
          }),
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: 'Назва заходу', alignment: 'center', bold: true })],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: 'Категорія', alignment: 'center', bold: true })],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({ text: 'Фінансування', alignment: 'center', bold: true })],
          }),
        ],
      }),
      // Додаємо рядки з даними
      ...measures.map((item, index) => createYearMeasureRow(item, index + 1)),
    ],
  });
  
  return table;
};

// Функція для створення рядка таблиці з заходами за рік
const createYearMeasureRow = (item: any, index: number): TableRow => {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ text: index.toString(), alignment: 'center' })],
      }),
      new TableCell({
        children: [new Paragraph({ text: item.measure?.name || 'Невідомий захід' })],
      }),
      new TableCell({
        children: [new Paragraph({ 
          text: item.measure?.category?.name || 'Не вказано',
          alignment: 'center',
        })],
      }),
      new TableCell({
        children: [new Paragraph({ 
          text: formatCurrency(item.planned_funding), 
          alignment: 'right',
        })],
      }),
    ],
  });
};

// Допоміжні функції
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('uk-UA', { 
    style: 'currency', 
    currency: 'UAH',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
