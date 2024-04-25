import { Request, Response } from "express";
import { createObjectCsvStringifier } from "csv-writer";

export async function generateCSVByData(req: Request, res: Response) {
  const { header, data, disclaimer } = req.body;

  let headerFormatted = header;
  let dataFormatted = data;
  if (disclaimer) {
    headerFormatted = header.map((item: any, index: number) => {
      if (index === 0) {
        return { id: item.id, title: disclaimer };
      }
      return { id: item.id, title: "" };
    });
    const titleData = header.reduce((acc: any, item: any) => {
      acc[item.id] = item.title;
      return acc;
    }, {});

    dataFormatted = [{}, titleData, ...dataFormatted];
  }
  const csvStringifier = createObjectCsvStringifier({
    header: headerFormatted,
  });

  const csvString =
    csvStringifier.getHeaderString() +
    "\n" +
    csvStringifier.stringifyRecords(dataFormatted);

  res.setHeader("Content-Disposition", 'attachment; filename="output.csv"');
  res.setHeader("Content-Type", "text/csv");

  res.send(csvString);
}
