import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File upload is required');
    return this.fileService.handleCsvUpload(file);
  }
}
