import { Module, Injectable, Controller, Post, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import * as multer from 'multer';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    resourceType: 'image' | 'video' = 'image',
    folder = 'soloma',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: Record<string, any> =
        resourceType === 'video'
          ? { folder, resource_type: 'video' }
          : { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] };
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });
  }

  extractPublicId(url: string): string | null {
    // https://res.cloudinary.com/<cloud>/image/upload/v123/folder/file.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
    return match ? match[1] : null;
  }

  async deleteFile(url: string): Promise<void> {
    const publicId = this.extractPublicId(url);
    if (!publicId) throw new BadRequestException('URL Cloudinary invalide');
    // Détecte le type de ressource depuis l'URL (/video/upload/ vs /image/upload/)
    const resourceType = /\/video\/upload\//i.test(url) ? 'video' : 'image';
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new BadRequestException(`Échec suppression Cloudinary: ${result.result}`);
    }
  }
}

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload une image vers Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Le fichier doit être une image');
    const url = await this.uploadService.uploadFile(file);
    return { url };
  }

  @Post('video')
  @ApiOperation({ summary: 'Upload une vidéo vers Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } }))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');
    if (!file.mimetype.startsWith('video/')) throw new BadRequestException('Le fichier doit être une vidéo');
    const url = await this.uploadService.uploadFile(file, 'video');
    return { url };
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer une image de Cloudinary' })
  async remove(@Body('url') url: string) {
    if (!url) throw new BadRequestException('URL requise');
    await this.uploadService.deleteFile(url);
    return { message: 'Image supprimée' };
  }
}

@Module({
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
