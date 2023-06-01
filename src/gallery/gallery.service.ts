import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
import weaviate from 'weaviate-ts-client';

@Injectable()
export class GalleryService {
  client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
  });
  async create(createGalleryDto: any, file: Express.Multer.File) {
    try {
      if (!file) return console.log('File not found');
      await this.client.data
        .creator()
        .withClassName('Meme')
        .withId(randomUUID())
        .withProperties({
          image: file.buffer.toString('base64'),
          text: file.originalname.split('.')[0].split('_').join(' '),
        })
        .do();
      return {
        message: 'Image added',
      };
    } catch (err) {
      return err.message;
    }
  }

  async findAll(req) {
    const { limit } = req.query;
    try {
      const resImage = await this.client.graphql
        .get()
        .withClassName('Meme')
        .withFields('image text')
        .withLimit(limit || 10)
        .do();
      return resImage.data.Get.Meme;
    } catch (err) {
      return err.message;
    }
  }

  async search(file) {
    try {
      if (!file) return console.log('File not found');
      const resImage = await this.client.graphql
        .get()
        .withClassName('Meme')
        .withFields('image text')
        .withNearImage({
          image: file.buffer.toString('base64'),
        })
        .do();
      const result = resImage.data.Get.Meme[0];
      writeFileSync('./result.jpg', resImage.data.Get.Meme[0].image, 'base64');
      return result;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} gallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`;
  }
}
