import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { UploadFilesDto } from './dto/upload.file.dto';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    return Promise.all(
      files.map((file) =>
        this.fileService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
        ),
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.fileService.deleteFile(id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.fileService.getFile(id);
  }
}
