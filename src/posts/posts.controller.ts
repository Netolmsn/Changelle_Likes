import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { LikesService } from '../likes/likes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo post' })
  @ApiBody({ schema: { example: { title: 'Meu Post', content: 'Conteúdo aqui' } } })
  create(@Body() createPostDto: any) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get('ranking')
  @ApiOperation({ summary: 'Listar posts com mais likes (Ranking)' })
  getRanking() {
    return this.postsService.getRanking();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar post por ID' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Registrar um like em um post' })
  @ApiBody({ schema: { example: { userId: 'user_123' } } })
  @ApiResponse({ status: 201, description: 'Like enviado para a fila.' })
  async addLike(@Param('id') id: string, @Body('userId') userId: string) {
    return this.likesService.addLike(id, userId);
  }
}