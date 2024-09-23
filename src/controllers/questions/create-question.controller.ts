import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

// const sessionBodySchema = z.object({
//   email: z.string().email('Invalid email format'),
//   password: z.string(),
// });

// class SessionDto extends createZodDto(sessionBodySchema) {}

@ApiTags('auth')
@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class AuthenticateController {
  constructor(
    // private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // @ApiBody({ type: SessionDto })
  @Post()
  @ApiOkResponse({ description: 'User authenticated successfully' })
  @ApiUnauthorizedResponse({
    description: 'User credentials do not match',
  })
  // @UsePipes(new ZodValidationPipe(sessionBodySchema))
  async handle(@Body() body: SessionDto) {
    // const { email, password } = body;
  }
}
