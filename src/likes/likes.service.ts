import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class LikesService {
  constructor(
    @InjectQueue('likes-queue') private likesQueue: Queue,
  ) {}

  async addLike(postId: string, userId: string) {
    await this.likesQueue.add('process-like', {
      postId,
      userId,
    });

    return { message: 'Like enviado para processamento!' };
  }
}