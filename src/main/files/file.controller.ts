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
import { FileService } from './file.service';
import { ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { UploadFilesDto } from './dto/upload.file.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';


@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ---------------------- UPLOAD MULTIPLE FILES ----------------------
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5)) // max 5 files
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    // map over files and upload via Prisma-backed service
    return Promise.all(
      files.map((f) =>
        this.fileService.uploadFile(f.buffer, f.originalname, f.mimetype),
      ),
    );
  }

  // ---------------------- DELETE FILE BY ID ----------------------
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.fileService.deleteFile(id);
  }

  // ---------------------- GET FILE BY ID ----------------------
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.fileService.getFile(id);
  }

  // ---------------------- CLOUDINARY UPLOAD ----------------------
  @Post('cloudinary/upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  async uploadToCloudinary(@UploadedFiles() files: Express.Multer.File[]) {
    return Promise.all(
      files.map((file) =>
        this.cloudinaryService.uploadFileBuffer(
          file.buffer,
          file.originalname,
          file.mimetype,
        ),
      ),
    );
  }

  // ---------------------- CLOUDINARY DELETE ----------------------
  @Delete('cloudinary/:id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the file in the database',
    example: '21805e86-b8f1-40db-9a9f-5d7eb20af97d',
  })
  async deleteFile(@Param('id') id: string) {
    return this.cloudinaryService.deleteResource(id);
  }
}
