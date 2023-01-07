import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FileService {
  constructor(private readonly db: PrismaService) {}

  async handleCsvUpload(file: Express.Multer.File) {
    const csvData = file.buffer.toString('utf-8');
    const parsedCsv = parse(csvData, { delimiter: ',', from_line: 2 });
    const data = parsedCsv.map(([name, days]) => ({
      name,
      days_to_expire: Number(days),
    }));
    await this.db.product.createMany({ data });
    return { message: 'File uploaded successfully' };
  }
}
