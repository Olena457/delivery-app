import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TelegramChat {
  @IsNumber()
  id!: number;

  @IsString()
  type!: string;
}

class TelegramMessage {
  @IsNumber()
  message_id!: number;

  @IsObject()
  @ValidateNested()
  @Type(() => TelegramChat)
  chat!: TelegramChat;

  @IsOptional()
  @IsString()
  text?: string;
}

export class TelegramUpdateDto {
  @IsNumber()
  update_id!: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TelegramMessage)
  message?: TelegramMessage;
}
