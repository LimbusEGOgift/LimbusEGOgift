import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FindEGOGiftByIdentityDto {
  @ApiProperty({
    description: '인격의 특성 키워드',
    example: '["LCB"]',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({
    message: '특성 키워드는 문자열 배열이여야 합니다.',
    each: true,
  })
  Trait!: string[];

  @ApiProperty({
    description: '인격의 키워드',
    example: '["범용"]',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({
    message: '키워드는 문자열 배열이여야 합니다.',
    each: true,
  })
  Keyword!: string[];

  @ApiProperty({
    description: '인격 스킬1의 특성',
    example: '["참격"]',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({
    message: '스킬 특성는 문자열 배열이여야 합니다.',
    each: true,
  })
  Skill1!: string[];

  @ApiProperty({
    description: '인격 스킬2의 특성',
    example: '["관통"]',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({
    message: '스킬 특성는 문자열 배열이여야 합니다.',
    each: true,
  })
  Skill2!: string[];

  @ApiProperty({
    description: '인격 스킬3의 특성',
    example: '["타격"]',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({
    message: '스킬 특성는 문자열 배열이여야 합니다.',
    each: true,
  })
  Skill3!: string[];

  @ApiProperty({
    description: '인격의 편성 번호',
    example: "1",
  })
  @IsNotEmpty()
  @IsString({
    message: '편성은 문자열이여야 합니다.',
  })
  Formation!: string;
}
