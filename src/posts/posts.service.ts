import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager'; 

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const cachedPosts = await this.cacheManager.get('all_posts');
    if (cachedPosts) return cachedPosts;

    const posts = await this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    await this.cacheManager.set('all_posts', posts, 10000); // Cache por 10 seg
    return posts;
  }

  async getRanking() {
    const cachedRanking = await this.cacheManager.get('posts_ranking');
    if (cachedRanking) return cachedRanking;

    const ranking = await this.prisma.post.findMany({
      orderBy: { likesCount: 'desc' },
      take: 10,
    });
    await this.cacheManager.set('posts_ranking', ranking, 30000);
    return ranking;
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async create(data: any) {
    await this.cacheManager.del('all_posts');
    return this.prisma.post.create({ data });
  }
}