import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CustomListDto } from 'src/place/dto/subway.dto';

export class ApiSubwayGetCheckResponseDto {
  @Expose()
  @Type(() => CustomListDto)
  @ApiProperty({
    example: { RESTAURANT: 12, CAFE: 3, BAR: 24, SHOPPING: 3, CULTURE: 0, ENTERTAINMENT: 1 },
    description: '커스텀',
  })
  items: CustomListDto;

  constructor(data?: Partial<ApiSubwayGetCheckResponseDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
