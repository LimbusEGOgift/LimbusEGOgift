import { IsString, IsNotEmpty } from 'class-validator';

export class FindEGOGiftDto {
  @IsNotEmpty()
  @IsString()
  sinner!: string;

  @IsNotEmpty()
  @IsString()
  identity!: string;
}
