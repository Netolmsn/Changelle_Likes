import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [PrismaModule, LikesModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}