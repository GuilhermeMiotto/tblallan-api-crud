import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getAllUsersWithPasswords() {
    return this.adminService.getAllUsersWithPasswords();
  }

  @Get('users/:id')
  getUserWithPassword(@Param('id') id: string) {
    return this.adminService.getUserWithPassword(+id);
  }

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(+id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  @Get('posts')
  getAllPosts() {
    return this.adminService.getAllPosts();
  }

  @Get('posts/:id')
  getPostById(@Param('id') id: string) {
    return this.adminService.getPostById(+id);
  }
}
