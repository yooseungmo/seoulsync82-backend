import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ApiPlaceGetExhibitionResponseDto {
  @Expose()
  @ApiProperty({
    example: 535,
    description: '장소 아이디',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: '00145054384a4b0d85b4198c6e54404f',
    description: '장소 uuid',
  })
  uuid: string;

  @Expose()
  @ApiProperty({
    example: '팝업',
    description: '장소 종류',
  })
  place_type: string;

  @Expose()
  @ApiProperty({
    example: '쫄깃즈 키링 팝업스토어',
    description: '장소 이름',
  })
  place_name: string;

  @Expose()
  @ApiProperty({
    example: '서울특별시 종로구 돈화문로11나길 28-1 1호 익선스페이스 A홀',
    description: '주소',
  })
  address: string;

  @Expose()
  @ApiProperty({
    example:
      'https://cf-templates-1gyolugg9zn9q-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/store/b4d678db%2C701e%2C482e%2C8a18%2C4b4a4f7a352f',
    description: '장소 썸네일',
  })
  thumbnail: string;

  @Expose()
  @ApiProperty({
    example: '2023-10-21 00:00:00',
    description: '시작일',
  })
  start_date: Date;

  @Expose()
  @ApiProperty({
    example: '2023-12-31 00:00:00',
    description: '마감일',
  })
  end_date: Date;

  @Expose()
  @ApiProperty({
    example: ' 월~금요일 10:00~18:00· 토요일 12:00~19:00',
    description: '전시 영업 시간',
  })
  @Transform(({ value }) => value ?? undefined)
  operation_time?: string;

  @Expose()
  @ApiProperty({
    example: ' 일요일 휴관',
    description: '전시 휴무일',
  })
  @Transform(({ value }) => value ?? undefined)
  closed_days?: string;

  @Expose()
  @ApiProperty({
    example: ' 무료',
    description: '전시 입장료',
  })
  @Transform(({ value }) => value ?? undefined)
  entrance_fee?: string;

  @Expose()
  @ApiProperty({
    example: '서울특별시 성동구',
    description: '전시/팝업 장소',
  })
  top_level_address: string;
}
