import { IsNotEmpty, IsString } from 'class-validator';

export class FindEGOGiftByIdentityDto {
  @IsString()
  @IsNotEmpty()
  Category!: string;

  @IsString()
  @IsNotEmpty()
  EGOGift!: string;
}
