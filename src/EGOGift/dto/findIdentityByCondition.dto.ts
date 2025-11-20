import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

export class FindIdentityByEGOGiftDto {
  @ApiProperty({
    description: 'EGOGift의 특성 키워드 조건',
    example: '["LCB"]',
  })
  @IsArray()
  @IsString({
    message: '특성 키워드는 문자열 배열이여야 합니다.',
    each: true,
  })
  Trait!: string[];

  @ApiProperty({
    description: 'EGOGift의 키워드 조건',
    example: '["범용"]',
  })
  @IsArray()
  @IsString({
    message: '키워드는 문자열 배열이여야 합니다.',
    each: true,
  })
  Keyword!: string[];

  @ApiProperty({
    description: 'EGOGift 스킬1의 특성 조건',
    example: '["참격"]',
  })
  @IsArray()
  @IsString({
    message: '스킬 특성는 문자열 배열이여야 합니다.',
    each: true,
  })
  Skill1!: string[];

  @ApiProperty({
    description: 'EGOGift 스킬2의 특성 조건',
    example: '["관통"]',
  })
  @IsArray()
  @IsString({
    message: '스킬 특성는 문자열 배열이여야 합니다.',
    each: true,
  })
  Skill2!: string[];

  @ApiProperty({
    description: 'EGOGift 스킬3의 특성 조건',
    example: '["타격"]',
  })
  @IsArray()
  @IsString({
    message: '스킬 특성는 문자열 배열이여야 합니다.',
    each: true,
  })
  Skill3!: string[];

  @ApiProperty({
    description: '인격의 편성 번호',
    example: '1',
  })
  @IsInt({
    message: '편성은 숫자이여야 합니다.',
  })
  Formation!: number;
}
