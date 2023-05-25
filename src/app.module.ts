import { PrismaModule } from './prisma/prisma.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    BooksModule,
  ],
})
export class AppModule {}
