import { InjectRepository } from '@nestjs/typeorm';
import { ApiCourseGetMyHistoryRequestQueryDto } from 'src/course/dto/api-course-get-my-history-request-query.dto';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { CourseDetailEntity } from 'src/entities/course.detail.entity';
import { CourseEntity } from 'src/entities/course.entity';
import { In, LessThan, Repository } from 'typeorm';

export class CourseQueryRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private repository: Repository<CourseEntity>,
    @InjectRepository(CourseDetailEntity)
    private detailRepository: Repository<CourseDetailEntity>,
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  async saveCourse(courseEntity) {
    return this.repository.save(courseEntity);
  }

  async saveCourseDetail(courseDetailEntity) {
    return this.detailRepository.save(courseDetailEntity);
  }

  async findUserHistoryCourse(uuid: string): Promise<CourseDetailEntity[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.detailRepository
      .createQueryBuilder('courseDetail')
      .innerJoin('courseDetail.course', 'course')
      .where('course.user_uuid = :uuid', { uuid })
      .andWhere('course.created_at >= :sevenDaysAgo', { sevenDaysAgo })
      .select('courseDetail.place_uuid')
      .getMany();
  }

  async findCourse(uuid): Promise<CourseEntity> {
    return this.repository.findOne({
      where: { uuid },
    });
  }

  async findPlace(courseUuid: string): Promise<CourseDetailEntity[]> {
    return this.detailRepository
      .createQueryBuilder('courseDetail')
      .leftJoinAndSelect('courseDetail.place', 'place')
      .where('courseDetail.course_uuid = :courseUuid', { courseUuid })
      .select(['courseDetail', 'place'])
      .getMany();
  }

  async findList(uuids): Promise<CourseEntity[]> {
    return this.repository.find({
      where: { uuid: In(uuids) },
    });
  }

  async findOne(uuid): Promise<CourseEntity> {
    return this.repository.findOne({
      where: { uuid },
    });
  }

  async findMyCourse(dto: ApiCourseGetMyHistoryRequestQueryDto, user): Promise<CourseEntity[]> {
    const whereConditions = { user_uuid: user.uuid };

    if (dto.last_id > 0) {
      Object.assign(whereConditions, { id: LessThan(dto.last_id) });
    }

    return this.repository.find({
      where: whereConditions,
      order: { created_at: 'DESC' },
      take: dto.size,
    });
  }

  async findUserCourse(uuid, user): Promise<CourseEntity> {
    return this.repository.findOne({
      where: { user_uuid: user.uuid },
    });
  }
}
