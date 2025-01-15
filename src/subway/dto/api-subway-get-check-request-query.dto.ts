import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class ApiSubwayGetCheckRequestQueryDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: [
      '00145054384a4b0d85b4198c6e54404f',
      '00f239d44c7141e5942957c2219dd885',
      '00f2fb983eec41a5a980747855752a6b',
    ],
    description: '장소 uuids',
  })
  place_uuids: string[];
}
