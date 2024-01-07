import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ERROR } from 'src/auth/constants/error';
import { DetailResponseDto, ResponseDataDto } from 'src/commons/dto/response.dto';
import { generateUUID } from 'src/commons/util/uuid';
import { ReactionQueryRepository } from 'src/community/reaction.query.repository';
import { CourseModule } from 'src/course/course.module';
import { CourseQueryRepository } from 'src/course/course.query.repository';
import { CoursePlaceDto, CourseRecommendResDto } from 'src/course/dto/course.dto';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { PlaceQueryRepository } from 'src/place/place.query.repository';
import { BookmarkListResDto, CourseSaveReqDto, MyCourseDetailResDto } from './dto/bookmark.dto';
import { BookmarkQueryRepository } from './bookmark.query.repository';
import { Emojis } from 'src/auth/constants/emoji';
import { UserQueryRepository } from 'src/user/user.query.repository';
import { isEmpty, isNotEmpty } from 'src/commons/util/is/is-empty';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly bookmarkQueryRepository: BookmarkQueryRepository,
    private readonly courseQueryRepository: CourseQueryRepository,
    private readonly placeQueryRepository: PlaceQueryRepository,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async bookmarkList(dto, user) {
    const courseList = await this.bookmarkQueryRepository.find(dto, user);
    if (courseList.length === 0) {
      return ResponseDataDto.from([], null, 0);
    }

    const userList = await this.userQueryRepository.findUserList(
      courseList.map((item) => item.user_uuid),
    );

    const bookmarkListResDto = plainToInstance(BookmarkListResDto, courseList, {
      excludeExtraneousValues: true,
    }).map((bookmark) => {
      bookmark.user_profile_image = userList.find(
        (user) => user.uuid === bookmark.user_uuid,
      ).profile_image;
      return bookmark;
    });

    const last_item_id = courseList.length === dto.size ? courseList[courseList.length - 1].id : 0;

    return { items: bookmarkListResDto, last_item_id };
  }

  async myCourseDetail(uuid) {
    const course = await this.bookmarkQueryRepository.findOne(uuid);
    if (!course) {
      throw new NotFoundException(ERROR.NOT_EXIST_DATA);
    }

    const coursePlaces = await this.courseQueryRepository.findPlace(course.course_uuid);

    const myCourseDetailResDto = new MyCourseDetailResDto({
      course_uuid: course.course_uuid,
      my_course_uuid: course.uuid,
      my_course_name: course.course_name,
      subway: course.subway,
      count: coursePlaces.length,
      place: plainToInstance(
        CoursePlaceDto,
        coursePlaces.map((coursePlace) => ({
          ...coursePlace.place,
          sort: coursePlace.sort,
          uuid: coursePlace.place_uuid,
        })),
        {
          excludeExtraneousValues: true,
        },
      ),
    });

    return myCourseDetailResDto;
  }

  async bookmarkSave(user, uuid) {
    const course = await this.courseQueryRepository.findCourse(uuid);
    if (!course) {
      throw new NotFoundException(ERROR.NOT_EXIST_DATA);
    }

    const bookmarkEntity = new BookmarkEntity();
    bookmarkEntity.uuid = generateUUID();
    bookmarkEntity.course_uuid = uuid;
    bookmarkEntity.subway = course.subway;
    bookmarkEntity.line = course.line;
    bookmarkEntity.course_name = course.course_name;
    bookmarkEntity.course_image = course.course_image;
    bookmarkEntity.user_uuid = user.uuid;
    bookmarkEntity.user_name = user.nickname;

    const myBookmark = await this.bookmarkQueryRepository.findUserBookmark(user, uuid);

    if (isEmpty(myBookmark)) {
      await this.bookmarkQueryRepository.bookmarkSave(bookmarkEntity);
    } else if (isEmpty(myBookmark.archived_at)) {
      throw new ConflictException(ERROR.DUPLICATION);
    } else {
      await this.bookmarkQueryRepository.bookmarkUpdate(bookmarkEntity);
    }

    return DetailResponseDto.uuid(uuid);
  }

  async bookmarkDelete(user, uuid) {
    const myBookmark = await this.bookmarkQueryRepository.findUserBookmark(user, uuid);
    if (!myBookmark) {
      throw new NotFoundException(ERROR.NOT_EXIST_DATA);
    } else await this.bookmarkQueryRepository.bookmarkDelete(myBookmark);

    return DetailResponseDto.uuid(uuid);
  }
}