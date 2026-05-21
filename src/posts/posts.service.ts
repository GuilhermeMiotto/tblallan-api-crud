import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: createPostDto.authorId,
      },
    });

    if (!user) {
      throw new HttpException('Author not found', 404);
    }

    return this.prisma.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    if (updatePostDto.authorId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: updatePostDto.authorId,
        },
      });

      if (!user) {
        throw new HttpException('Author not found', 404);
      }
    }

    return this.prisma.post.update({
      where: {
        id,
      },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
