import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  speaker: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsOptional()
  @IsString()
  size?: string;

  @IsUrl()
  downloadUrl: string;

  @IsUrl()
  @IsOptional() // Since it's set by the controller after upload
  imageUrl: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  isSeries: boolean;

  @ValidateIf((o) => o.isSeries === true)
  @IsString()
  seriesTitle: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  specialMeeting: boolean;

  @ValidateIf((o) => o.specialMeeting === true)
  @IsString()
  specialMeetingName: string;

  @IsOptional()
  @IsString()
  @MaxLength(400, { message: 'Description should not exceed 400 characters' })
  description?: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  duration: number;
}
