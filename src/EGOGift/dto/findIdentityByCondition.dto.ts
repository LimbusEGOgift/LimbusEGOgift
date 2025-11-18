import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class FindIdentityByConditionDto {
  @ApiProperty({
    description: "EGOGift의 조건",
    example: "[\"범용\"]"
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({
    message: "조건은 문자열이여야 합니다.",
    each: true
  })
  Condition!: string[];
}
