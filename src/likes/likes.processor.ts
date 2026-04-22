import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Processor('likes-queue')
export class LikesProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ postId: string; userId: string }>): Promise<void> {
    const { postId, userId } = job.data;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.like.create({
          data: { postId, userId },
        });

        await tx.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        });
      });
      console.log(`[Worker] Like registrado: User ${userId} -> Post ${postId}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.warn(`[Worker] Like ignorado: Usuário ${userId} já curtiu o post ${postId}`);
      }
    }
  }
}