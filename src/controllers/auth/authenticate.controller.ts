import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createZodDto, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcryptjs';

const sessionBodySchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

class SessionDto extends createZodDto(sessionBodySchema) {}

@ApiTags('auth')
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @ApiBody({ type: SessionDto })
  @Post()
  @ApiOkResponse({ description: 'User authenticated successfully' })
  @ApiUnauthorizedResponse({
    description: 'User credentials do not match',
  })
  @UsePipes(new ZodValidationPipe(sessionBodySchema))
  async handle(@Body() body: SessionDto) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User credentials do not match');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match');
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
    });

    return {
      access_token: accessToken,
    };
  }
}
