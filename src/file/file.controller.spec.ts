import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Readable } from 'node:stream';
import { PrismaService } from '../database/prisma.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import fs = require('node:fs/promises');
import path = require('node:path');

const fileToMulter = async (filename): Promise<Express.Multer.File> => {
  const file = await fs.readFile(filename);
  const multerFile: Express.Multer.File = {
    buffer: file,
    fieldname: 'file',
    originalname: 'produtos',
    encoding: 'utf-8',
    mimetype: 'text/csv',
    destination: 'destination-path',
    filename: 'produtos',
    path: 'file-path',
    size: Buffer.byteLength(file),
    stream: Readable.from(file),
  };
  return multerFile;
};

describe('FileController', () => {
  let fileController: FileController;
  let prisma: DeepMockProxy<PrismaClient>;
  let file: Express.Multer.File;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [FileService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    fileController = app.get<FileController>(FileController);
    prisma = app.get(PrismaService);
    file = await fileToMulter(
      path.resolve(__dirname, '../..', 'public', 'produtos.csv'),
    );
  });

  describe('/file/import', () => {
    it('should import csv file to db', () => {
      const resultPayload = { count: 1227 };
      prisma.product.createMany.mockResolvedValueOnce(resultPayload);
      expect(fileController.importCsv(file)).resolves.toStrictEqual({
        message: 'File uploaded successfully',
      });
    });
    it('should reject when no file is sent', () => {
      expect(fileController.importCsv).toThrow(
        new BadRequestException('File upload is required'),
      );
    });
  });
});
