import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
const path = require('node:path');
const fs = require('node:fs');

const prisma = new PrismaClient();
async function main() {
  await prisma.product.deleteMany();
  const csvPath = path.join(__dirname, '..', 'public', 'produtos.csv');
  const csvStream = fs.createReadStream(csvPath);
  const csvString = await new Promise<string>((res, rej) => {
    const chunks = [];
    csvStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    csvStream.on('error', (err) => rej(err));
    csvStream.on('end', () => res(Buffer.concat(chunks).toString('utf8')));
  });
  const parsedCsv = parse(csvString, { delimiter: ',', from_line: 2 });
  const data = parsedCsv.map(([name, days]) => ({
    name,
    days_to_expire: Number(days),
  }));
  await prisma.product.createMany({ data });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
