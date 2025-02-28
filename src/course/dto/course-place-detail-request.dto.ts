import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CoursePlaceDetailRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '장소 순서',
  })
  sort: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '00145054384a4b0d85b4198c6e54404f',
    description: '장소 uuid',
  })
  uuid: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '쫄깃즈 키링 팝업스토어',
    description: '장소 이름',
  })
  place_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '팝업',
    description: '장소 종류',
  })
  place_type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example:
      'https://cf-templates-1gyolugg9zn9q-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/store/b4d678db%2C701e%2C482e%2C8a18%2C4b4a4f7a352f',
    description: '장소 썸네일',
  })
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '서울특별시 종로구 돈화문로11나길 28-1 1호 익선스페이스 A홀',
    description: '주소',
  })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '27.0319456',
    description: '위도',
  })
  latitude: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '37.5070434',
    description: '경도',
  })
  longitude: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '4.0',
    description: '평점',
  })
  score?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '도미노 피자',
    description: '장소 추가 설명',
  })
  place_detail?: string;
}
