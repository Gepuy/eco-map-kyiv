import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { supabase } from '@/integrations/supabase/client';
import { MeasureCost, ProgramReport } from '@/types/managementTypes';

// Функція для експорту кошторису в Excel
export const exportCostEstimateToExcel = async (
  costEstimate: MeasureCost[],
  title: string = 'Кошторис витрат'
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Кошторис витрат');

  // Стилі для заголовків
  worksheet.getRow(1).font = { 
    bold: true, 
    size: 14, 
    name: 'Arial', 
    family: 2, 
    scheme: 'minor', 
    charset: 1, 
    color: { argb: 'FF000000' },
    italic: false,
    underline: false,
    strike: false,
    outline: false
  };
  worksheet.getRow(2).font = { 
    bold: true, 
    size: 12, 
    name: 'Arial', 
    family: 2, 
    scheme: 'minor', 
    charset: 1, 
    color: { argb: 'FF000000' },
    italic: false,
    underline: false,
    strike: false,
    outline: false
  };

  // Додаємо заголовок
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').value = title || 'Кошторис витрат на впровадження заходів';
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // Додаємо заголовки стовпців
  worksheet.getRow(2).values = [
    '№', 'Назва заходу', 'Ресурс', 'Кількість', 'Ціна за од., грн', 'Загальна вартість, грн'
  ];

  // Встановлюємо ширину стовпців
  worksheet.getColumn(1).width = 5;
  worksheet.getColumn(2).width = 40;
  worksheet.getColumn(3).width = 30;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 20;
  worksheet.getColumn(6).width = 25;

  // Заповнюємо дані
  let rowIndex = 3;
  let measureIndex = 1;
  let totalCost = 0;

  for (const measure of costEstimate) {
    const firstRow = rowIndex;
    
    for (let i = 0; i < measure.resources.length; i++) {
      const resource = measure.resources[i];
      
      worksheet.getRow(rowIndex).values = [
        i === 0 ? measureIndex : '',
        i === 0 ? measure.name : '',
        resource.name,
        resource.quantity,
        resource.unitPrice,
        resource.totalPrice
      ];

      if (i === 0) {
        worksheet.getCell(`A${rowIndex}`).alignment = { vertical: 'top' };
        worksheet.getCell(`B${rowIndex}`).alignment = { vertical: 'top' };
      }
      
      rowIndex++;
    }
    
    // Якщо захід має більше одного ресурсу, об'єднуємо клітинки
    if (measure.resources.length > 1) {
      worksheet.mergeCells(`A${firstRow}:A${rowIndex - 1}`);
      worksheet.mergeCells(`B${firstRow}:B${rowIndex - 1}`);
    }
    
    // Додаємо рядок з загальною вартістю заходу
    worksheet.getRow(rowIndex).values = [
      '', '', '', '', 'Разом за заходом:', measure.totalCost
    ];
    
    worksheet.getRow(rowIndex).font = { bold: true };
    worksheet.getCell(`F${rowIndex}`).numFmt = '# ##0.00 ₴';
    
    rowIndex++;
    measureIndex++;
    totalCost += measure.totalCost;
  }

  // Додаємо рядок з загальною вартістю всіх заходів
  worksheet.getRow(rowIndex).values = [
    '', '', '', '', 'ЗАГАЛЬНА ВАРТІСТЬ:', totalCost
  ];
  worksheet.getRow(rowIndex).font = { bold: true };
  worksheet.getRow(rowIndex).height = 20;
  worksheet.getCell(`F${rowIndex}`).numFmt = '# ##0.00 ₴';

  // Форматуємо числові стовпці
  for (let i = 3; i < rowIndex; i++) {
    worksheet.getCell(`D${i}`).numFmt = '# ##0.00';
    worksheet.getCell(`E${i}`).numFmt = '# ##0.00 ₴';
    worksheet.getCell(`F${i}`).numFmt = '# ##0.00 ₴';
  }

  // Додаємо границі для всієї таблиці
  for (let i = 2; i <= rowIndex; i++) {
    for (let j = 1; j <= 6; j++) {
      const cell = worksheet.getCell(`${String.fromCharCode(64 + j)}${i}`);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    }
  }

  // Експортуємо Excel файл
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${title} ${new Date().toLocaleDateString('uk-UA')}.xlsx`);
};

// Функція для експорту кошторису в Word
export const exportCostEstimateToWord = async (
  costEstimate: MeasureCost[],
  title: string = 'Кошторис витрат'
) => {
  // Створюємо таблицю
  const tableRows: TableRow[] = [];

  // Додаємо рядок заголовків
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: {
            size: 500,
            type: 'dxa',
          },
          children: [new Paragraph('№')],
          verticalAlign: 'center',
        }),
        new TableCell({
          width: {
            size: 3000,
            type: 'dxa',
          },
          children: [new Paragraph('Назва заходу')],
          verticalAlign: 'center',
        }),
        new TableCell({
          width: {
            size: 2000,
            type: 'dxa',
          },
          children: [new Paragraph('Ресурс')],
          verticalAlign: 'center',
        }),
        new TableCell({
          width: {
            size: 1000,
            type: 'dxa',
          },
          children: [new Paragraph('Кількість')],
          verticalAlign: 'center',
        }),
        new TableCell({
          width: {
            size: 1500,
            type: 'dxa',
          },
          children: [new Paragraph('Ціна за од., грн')],
          verticalAlign: 'center',
        }),
        new TableCell({
          width: {
            size: 1500,
            type: 'dxa',
          },
          children: [new Paragraph('Загальна вартість, грн')],
          verticalAlign: 'center',
        }),
      ],
    })
  );

  // Додаємо рядки з даними
  let measureIndex = 1;
  let totalCost = 0;

  for (const measure of costEstimate) {
    totalCost += measure.totalCost;

    for (let i = 0; i < measure.resources.length; i++) {
      const resource = measure.resources[i];
      
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(i === 0 ? measureIndex.toString() : '')],
            }),
            new TableCell({
              children: [new Paragraph(i === 0 ? measure.name : '')],
            }),
            new TableCell({
              children: [new Paragraph(resource.name)],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: resource.quantity.toString(),
                  alignment: 'right',
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: resource.unitPrice.toLocaleString('uk-UA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                  alignment: 'right',
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: resource.totalPrice.toLocaleString('uk-UA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                  alignment: 'right',
                }),
              ],
            }),
          ],
        })
      );
    }

    // Додаємо рядок з загальною вартістю заходу
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 5,
            children: [
              new Paragraph({
                text: 'Разом за заходом:',
                alignment: 'right',
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: measure.totalCost.toLocaleString('uk-UA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
                alignment: 'right',
              }),
            ],
          }),
        ],
      })
    );
    
    measureIndex++;
  }

  // Додаємо рядок з загальною вартістю
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 5,
          children: [
            new Paragraph({
              text: 'ЗАГАЛЬНА ВАРТІСТЬ:',
              alignment: 'right',
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: totalCost.toLocaleString('uk-UA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              alignment: 'right',
            }),
          ],
        }),
      ],
    })
  );

  // Створюємо документ
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title || 'Кошторис витрат на впровадження заходів',
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
          }),
          new Paragraph(''),
          new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: 'pct' as 'dxa' | 'auto' | 'nil' | 'pct', // Explicitly cast to correct type
            },
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: 1,
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: 1,
              },
              left: {
                style: BorderStyle.SINGLE,
                size: 1,
              },
              right: {
                style: BorderStyle.SINGLE,
                size: 1,
              },
              insideHorizontal: {
                style: BorderStyle.SINGLE,
                size: 1,
              },
              insideVertical: {
                style: BorderStyle.SINGLE,
                size: 1,
              },
            },
          }),
          new Paragraph(''),
          new Paragraph({
            children: [
              new TextRun({
                text: `Дата формування: ${new Date().toLocaleDateString('uk-UA')}`,
                italics: true, // This is the correct property name
              }),
            ],
            alignment: 'right',
          }),
        ],
      },
    ],
  });

  // Експортуємо Word документ
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `${title} ${new Date().toLocaleDateString('uk-UA')}.docx`);
};

// Функція для експорту до Excel (загальна)
export const exportToExcel = async (
  data: Record<string, any>[], 
  title: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  // Стилі для заголовків
  worksheet.getRow(1).font = { 
    bold: true, 
    size: 14, 
    name: 'Arial', 
    family: 2, 
    scheme: 'minor', 
    charset: 1, 
    color: { argb: 'FF000000' },
    italic: false,
    underline: false,
    strike: false,
    outline: false
  };
  worksheet.getRow(2).font = { 
    bold: true, 
    size: 12, 
    name: 'Arial', 
    family: 2, 
    scheme: 'minor', 
    charset: 1, 
    color: { argb: 'FF000000' },
    italic: false,
    underline: false,
    strike: false,
    outline: false
  };

  // Додаємо заголовок
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').value = title;
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // Отримуємо заголовки колонок з 1-го об'єкту
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.getRow(2).values = headers;

    // Додаємо дані
    data.forEach((item, index) => {
      const rowIndex = index + 3;
      const rowData = Object.values(item);
      worksheet.getRow(rowIndex).values = rowData;
    });

    // Форматуємо таблицю
    for (let i = 2; i <= data.length + 2; i++) {
      for (let j = 1; j <= headers.length; j++) {
        const cell = worksheet.getCell(`${String.fromCharCode(64 + j)}${i}`);
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      }
    }
  }

  // Експортуємо Excel файл
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${title} ${new Date().toLocaleDateString('uk-UA')}.xlsx`);
};

// Функція для експорту регіональної програми у Word
export const exportRegionalProgramToWord = async (
  programReport: ProgramReport,
  title: string
) => {
  // Створюємо документ
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title || programReport.program.name,
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
          }),
          new Paragraph(''),
          new Paragraph({
            text: `Період: ${new Date(programReport.program.start_date).toLocaleDateString('uk-UA')} - ${new Date(programReport.program.end_date).toLocaleDateString('uk-UA')}`,
          }),
          new Paragraph({
            text: `Загальний бюджет: ${programReport.totalBudget.toLocaleString('uk-UA')} грн`,
          }),
          new Paragraph(''),
          new Paragraph({
            text: 'Перелік заходів:',
            heading: HeadingLevel.HEADING_2,
          }),
          // Додаємо таблицю з заходами по рокам
          ...programReport.years.map(year => {
            const yearMeasures = programReport.measuresByYear[year];
            const tableRows = [
              // Заголовок таблиці
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [new Paragraph(`Заходи на ${year} рік`)],
                    columnSpan: 4,
                  }),
                ],
              }),
              // Заголовки колонок
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph('Назва')] }),
                  new TableCell({ children: [new Paragraph('Категорія')] }),
                  new TableCell({ children: [new Paragraph('Ефективність')] }),
                  new TableCell({ children: [new Paragraph('Фінансування')] }),
                ],
              }),
              // Дані
              ...yearMeasures.map(measure => 
                new TableRow({
                  children: [
                    new TableCell({ 
                      children: [new Paragraph(measure.measure?.name || `Захід #${measure.measure_id}`)] 
                    }),
                    new TableCell({ 
                      children: [new Paragraph(measure.measure?.category?.name || 'Не визначено')] 
                    }),
                    new TableCell({ 
                      children: [new Paragraph(`${measure.measure?.effectiveness || 0}%`)] 
                    }),
                    new TableCell({ 
                      children: [
                        new Paragraph({
                          text: measure.planned_funding.toLocaleString('uk-UA'),
                          alignment: 'right',
                        })
                      ] 
                    }),
                  ],
                })
              ),
              // Підсумок
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [
                      new Paragraph({
                        text: `Всього за ${year} рік:`,
                        alignment: 'right',
                      })
                    ],
                    columnSpan: 3,
                  }),
                  new TableCell({ 
                    children: [
                      new Paragraph({
                        text: programReport.totalByYear[year].toLocaleString('uk-UA'),
                        alignment: 'right',
                      })
                    ] 
                  }),
                ],
              }),
            ];

            return [
              new Paragraph(''),
              new Table({
                rows: tableRows,
                width: {
                  size: 100,
                  type: 'pct' as 'dxa' | 'auto' | 'nil' | 'pct', // Explicitly cast to correct type
                },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ];
          }).flat(),
          new Paragraph(''),
          new Paragraph({
            children: [
              new TextRun({
                text: `Дата формування: ${new Date().toLocaleDateString('uk-UA')}`,
                italics: true,
              }),
            ],
            alignment: 'right',
          }),
        ],
      },
    ],
  });

  // Експортуємо Word документ
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `${title} ${new Date().toLocaleDateString('uk-UA')}.docx`);
};

// Зберігаємо оригінальну функцію для зворотньої сумісності
export const exportProgramToExcel = async (programReport: ProgramReport) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Програма розвитку');

  // Стилі для заголовків
  worksheet.getRow(1).font = { 
    bold: true, 
    size: 14, 
    name: 'Arial', 
    family: 2, 
    scheme: 'minor', 
    charset: 1, 
    color: { argb: 'FF000000' },
    italic: false,
    underline: false,
    strike: false,
    outline: false
  };
  worksheet.getRow(2).font = { 
    bold: true, 
    size: 12, 
    name: 'Arial', 
    family: 2, 
    scheme: 'minor', 
    charset: 1, 
    color: { argb: 'FF000000' },
    italic: false,
    underline: false,
    strike: false,
    outline: false
  };
  worksheet.getRow(3).font = { 
    bold: true, 
    size: 12, 
    name: 'Arial', 
    family: 2, 
    scheme: 'minor', 
    charset: 1, 
    color: { argb: 'FF000000' },
    italic: false,
    underline: false,
    strike: false,
    outline: false
  };

  // Додаємо заголовок
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').value = programReport.program.name;
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // Додаємо інформацію про програму
  worksheet.getCell('A2').value = 'Період:';
  worksheet.getCell('B2').value = `${new Date(programReport.program.start_date).toLocaleDateString('uk-UA')} - ${new Date(programReport.program.end_date).toLocaleDateString('uk-UA')}`;
  worksheet.getCell('D2').value = 'Бюджет:';
  worksheet.getCell('E2').value = programReport.totalBudget.toLocaleString('uk-UA') + ' грн';

  // Встановлюємо ширину стовпців
  worksheet.getColumn(1).width = 5;
  worksheet.getColumn(2).width = 40;
  worksheet.getColumn(3).width = 20;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 25;

  // Додаємо заголовки таблиці
  worksheet.getCell('A4').value = '№';
  worksheet.getCell('B4').value = 'Назва заходу';
  worksheet.getCell('C4').value = 'Категорія';
  worksheet.getCell('D4').value = 'Рік';
  worksheet.getCell('E4').value = 'Фінансування, грн';

  let rowIndex = 5;
  let measureIndex = 1;

  // Додаємо дані по рокам
  for (const year of programReport.years) {
    const yearMeasures = programReport.measuresByYear[year];
    
    for (const measure of yearMeasures) {
      worksheet.getRow(rowIndex).values = [
        measureIndex,
        measure.measure?.name || `Захід #${measure.measure_id}`,
        measure.measure?.category?.name || 'Не визначено',
        year,
        measure.planned_funding
      ];
      
      // Форматування
      worksheet.getCell(`E${rowIndex}`).numFmt = '# ##0.00 ₴';
      
      rowIndex++;
      measureIndex++;
    }
    
    // Додаємо підсумок за рік
    worksheet.getRow(rowIndex).values = [
      '', 'Всього за ' + year + ' рік:', '', '', programReport.totalByYear[year]
    ];
    
    worksheet.getRow(rowIndex).font = { bold: true };
    worksheet.getCell(`E${rowIndex}`).numFmt = '# ##0.00 ₴';
    
    rowIndex += 2; // Додаємо пустий рядок
  }

  // Додаємо загальний підсумок
  const totalFunding = programReport.years.reduce((sum, year) => sum + programReport.totalByYear[year], 0);
  
  worksheet.getRow(rowIndex).values = [
    '', 'ЗАГАЛЬНЕ ФІНАНСУВАННЯ:', '', '', totalFunding
  ];
  
  worksheet.getRow(rowIndex).font = { bold: true };
  worksheet.getCell(`E${rowIndex}`).numFmt = '# ##0.00 ₴';
  
  rowIndex += 2;

  // Додаємо розподіл по категоріям
  worksheet.getCell(`A${rowIndex}`).value = 'Розподіл за категоріями';
  worksheet.getCell(`A${rowIndex}`).font = { bold: true, size: 12 };
  rowIndex++;

  worksheet.getRow(rowIndex).values = [
    '№', 'Категорія', 'Кількість заходів', 'Фінансування, грн', 'Відсоток від бюджету'
  ];
  
  worksheet.getRow(rowIndex).font = { bold: true };
  
  rowIndex++;

  // Додаємо дані про категорії
  let catIndex = 1;
  
  for (const category of programReport.categoriesDistribution) {
    worksheet.getRow(rowIndex).values = [
      catIndex,
      category.categoryName,
      category.count,
      category.funding,
      category.percentage.toFixed(2) + '%'
    ];
    
    worksheet.getCell(`D${rowIndex}`).numFmt = '# ##0.00 ₴';
    
    rowIndex++;
    catIndex++;
  }

  // Додаємо границі для всієї таблиці
  for (let i = 4; i < rowIndex; i++) {
    for (let j = 1; j <= 5; j++) {
      const cell = worksheet.getCell(`${String.fromCharCode(64 + j)}${i}`);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    }
  }

  // Експортуємо Excel файл
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Програма розвитку ${programReport.program.name}.xlsx`);
};
