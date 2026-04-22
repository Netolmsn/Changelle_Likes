import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { BullModule } from '@nestjs/bullmq';
import { LikesProcessor } from './likes.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'likes-queue',
    }),
    PrismaModule,
  ],
  providers: [LikesService, LikesProcessor],
  exports: [LikesService],
})
export class LikesModule {}