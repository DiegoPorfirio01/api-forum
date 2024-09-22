import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { hash } from 'bcryptjs';

const createAccountBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

class CreateAccountDto extends createZodDto(createAccountBodySchema) {}

@ApiTags('accounts')
@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @ApiBody({ type: CreateAccountDto })
  @Post()
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  @ApiConflictResponse({
    description: 'User with the same e-mail already exists',
  })
  async handle(@Body() body: CreateAccountDto) {
    const { name, email, password } = createAccountBodySchema.parse(body);

    const hasOtherUserSameEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (hasOtherUserSameEmail) {
      throw new ConflictException(
        'User with the same e-mail address already exists',
      );
    }

    const hashPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
  }
}
