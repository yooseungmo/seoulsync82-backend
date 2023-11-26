import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/course/course.module';
import { CommunityEntity } from 'src/entities/community.entity';
import { MyCourseModule } from 'src/my_course/my_course.module';
import { CommunityController } from './community.controller';
import { CommunityQueryRepository } from './community.query.repository';
import { CommunityService } from './community.service';

@Module({
  imports: [CourseModule, MyCourseModule, TypeOrmModule.forFeature([CommunityEntity])],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityQueryRepository],
})
export class CommunityModule {}
