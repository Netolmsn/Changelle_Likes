import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { BullModule } from '@nestjs/bullmq';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
    }),
    PostsModule,
    LikesModule,
  ],
})
export class AppModule {}