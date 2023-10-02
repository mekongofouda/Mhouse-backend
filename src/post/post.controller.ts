import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReferencePipe } from 'src/pipes/reference/reference.pipe';
import { ListPostDto } from './dto/list-post.dto';
import { PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Account } from 'src/decorators/account.decorator';

@Controller('post')
export class PostController {

  constructor(
    private readonly postService: PostService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async post(
    @Account() user,
    @Body(ReferencePipe) postDto: PostDto
    ): Promise<PostEntity> {
      return await this.postService.post(postDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async listPost(
    @Query() listPostDto: ListPostDto,
    @Account() user
  ): Promise<PostEntity[]> {
    return await this.postService.listPost(listPostDto, user);
  }

  @Get(':ref')
  @UseGuards(JwtAuthGuard)
  async showPostDetail(
    @Param('ref') ref: string
    ): Promise<PostEntity> {
    return await this.postService.showPostDetail(ref);
  }

  @Patch(':ref')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('ref') ref: string, 
    @Body() updatePostDto: UpdatePostDto
    ): Promise<PostEntity> {
    return this.postService.updatePost(ref, updatePostDto);
  }

  @Delete(':ref')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('ref') ref: string
    ): Promise<PostEntity> {
    return await this.postService.deletePost(ref);
  }
}
