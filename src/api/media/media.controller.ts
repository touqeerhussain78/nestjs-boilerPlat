import { extname } from 'path';
import {
  Get,
  Post,
  Param,
  Controller,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { storage, imageValidator } from '@/utils';
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(protected readonly service: MediaService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('media', storage('media')))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateMediaDto,
  })
  create(
    @UploadedFile(imageValidator)
    media: Express.Multer.File,
  ) {
    const {
      size,
      filename: name,
      mimetype: mimeType,
      path,
      originalname,
    } = media;
    const link = path.replace('public', '');
    const extension = extname(originalname).replace('.', '');

    return this.service.create({ name, link, size, mimeType, extension });
  }
}
