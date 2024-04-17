import { Request, Response } from "express";
import { createObjectCsvStringifier } from "csv-writer";

export async function generateCSVByData(req: Request, res: Response) {
  const { header, data } = req.body;
  const csvStringifier = createObjectCsvStringifier({
    header,
  });

  const csvString =
    csvStringifier.getHeaderString() +
    "\n" +
    csvStringifier.stringifyRecords(data);

  res.setHeader("Content-Disposition", 'attachment; filename="output.csv"');
  res.setHeader("Content-Type", "text/csv");

  res.send(csvString);
}
