import { CreateMessageDto } from './create-message.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
