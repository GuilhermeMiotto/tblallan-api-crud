import { HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsersWithPasswords() {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async getUserWithPassword(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new HttpException('User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      include: {
        posts: true,
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        posts: true,
      },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.prisma.post.deleteMany({
      where: { authorId: id },
    });

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      include: {
        author: {
          include: {
            posts: true,
          },
        },
      },
    });
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            posts: true,
          },
        },
      },
    });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    return post;
  }
}
