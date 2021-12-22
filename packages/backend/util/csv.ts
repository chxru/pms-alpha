import { createReadStream } from "fs";
import { parse } from "csv-parse";
import path from "path";

const ParseDiagnosisCSV = async (
  filename: string
): Promise<{ categories: Set<string>; records: [string, string][] }> => {
  const categories = new Set<string>();
  const records: [string, string][] = [];

  const parser = createReadStream(
    path.join(process.cwd(), "../", "../", "uploads", "diag", filename)
  ).pipe(parse({ columns: false, ltrim: true }));

  for await (const record of parser) {
    records.push(record);
    categories.add(record[1]);
  }

  return { categories, records };
};

export { ParseDiagnosisCSV };
