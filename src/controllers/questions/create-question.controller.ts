import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import { z } from 'zod';
import { createZodDto, ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const createQuestionBodySchema = z.object({
  title: z.string().min(1, 'Title is required'), // Adicionando uma mensagem de erro customizada
  content: z.string().min(1, 'Content is required'), // Adicionando uma mensagem de erro customizada
});

class CreateQuestionDto extends createZodDto(createQuestionBodySchema) {}

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@ApiTags('questions')
@Controller('/questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @ApiBody({ type: CreateQuestionDto })
  @Post()
  @ApiCreatedResponse({ description: 'Question created successfully' })
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;
    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });
  }

  private convertToSlug(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
