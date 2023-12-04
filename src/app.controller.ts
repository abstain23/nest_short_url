import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ShortLongMapService } from './short-long-map.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  private shortLongMapService: ShortLongMapService;

  @Get('short_url')
  async generateShortUrl(@Query('url') url: string): Promise<string> {
    return this.shortLongMapService.generate(url);
  }

  @Get(':code')
  @Redirect()
  async jump(@Param('code') code: string) {
    const longUrl = await this.shortLongMapService.getLongUrl(code);
    if (!longUrl) {
      throw new BadRequestException('短链不存在');
    }
    return {
      url: longUrl,
      statusCode: 302,
    };
  }
}
