import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
const path = require('node:path');
const fs = require('node:fs/promises');

const prisma = new PrismaClient();
async function main() {
  await prisma.product.deleteMany();
  const csvPath = path.join(__dirname, '..', 'public', 'produtos.csv');
  const csvBuffer = await fs.readFile(csvPath);
  const csvString = csvBuffer.toString('utf8');
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
