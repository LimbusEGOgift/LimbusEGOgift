import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class FindEGOGiftByKeywordDto {
  @ApiProperty({
    description: '인격의 키워드',
    example: '["범용"]',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({
    message: '키워드는 문자열이여야 합니다.',
    each: true,
  })
  KeyWord!: string[];
}
