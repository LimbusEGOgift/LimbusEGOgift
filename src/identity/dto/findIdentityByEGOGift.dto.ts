import { IsString, IsNotEmpty } from 'class-validator';

export class FindIdentityByEGOGiftDto {
  @IsNotEmpty()
  @IsString()
  sinner!: string;

  @IsNotEmpty()
  @IsString()
  identity!: string;
}
