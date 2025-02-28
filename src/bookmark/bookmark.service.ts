import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BookmarkQueryRepository } from 'src/bookmark/bookmark.query.repository';
import { ApiBookmarkGetDetailResponseDto } from 'src/bookmark/dto/api-bookmark-get-detail-response.dto';
import { ApiBookmarkGetRequestQueryDto } from 'src/bookmark/dto/api-bookmark-get-request-query.dto';
import { ApiBookmarkGetResponseDto } from 'src/bookmark/dto/api-bookmark-get-response.dto';
import { bookmarkCoursePlaceDetailDto } from 'src/bookmark/dto/bookmark-course-place-detail.dto';
import { ERROR } from 'src/commons/constants/error';
import { LastItemIdResponseDto } from 'src/commons/dtos/last-item-id-response.dto';
import { UuidResponseDto } from 'src/commons/dtos/uuid-response.dto';
import { isEmpty } from 'src/commons/util/is/is-empty';
import { generateUUID } from 'src/commons/util/uuid';
import { CourseQueryRepository } from 'src/course/course.query.repository';
import { BookmarkEntity } from 'src/entities/bookmark.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { UserQueryRepository } from 'src/user/user.query.repository';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly bookmarkQueryRepository: BookmarkQueryRepository,
    private readonly courseQueryRepository: CourseQueryRepository,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async bookmarkList(
    dto: ApiBookmarkGetRequestQueryDto,
    user: UserDto,
  ): Promise<LastItemIdResponseDto<ApiBookmarkGetResponseDto>> {
    const courseList = await this.bookmarkQueryRepository.find(dto, user);
    if (isEmpty(courseList.length)) {
      return { items: [], last_item_id: 0 };
    }

    const userList = await this.userQueryRepository.findUserList(
      courseList.map((item) => item.user_uuid),
    );

    const lastItemId = courseList.length === dto.size ? courseList[courseList.length - 1].id : 0;

    return {
      items: plainToInstance(ApiBookmarkGetResponseDto, courseList, {
        excludeExtraneousValues: true,
      }).map((bookmark) => ({
        ...bookmark,
        user_profile_image:
          userList.find((u) => u.uuid === bookmark.user_uuid).profile_image ?? null,
      })),
      last_item_id: lastItemId,
    };
  }

  async myCourseDetail(uuid: string): Promise<ApiBookmarkGetDetailResponseDto> {
    const course = await this.bookmarkQueryRepository.findOne(uuid);
    if (isEmpty(course)) {
      throw new NotFoundException(ERROR.NOT_EXIST_DATA);
    }

    const coursePlaces = await this.courseQueryRepository.findPlace(course.course_uuid);

    return new ApiBookmarkGetDetailResponseDto({
      course_uuid: course.course_uuid,
      my_course_uuid: course.uuid,
      my_course_name: course.course_name,
      subway: course.subway,
      count: coursePlaces.length,
      place: plainToInstance(
        bookmarkCoursePlaceDetailDto,
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
  }

  async bookmarkSave(user: UserDto, uuid: string): Promise<UuidResponseDto> {
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

    return { uuid };
  }

  async bookmarkDelete(user: UserDto, uuid: string): Promise<UuidResponseDto> {
    const myBookmark = await this.bookmarkQueryRepository.findUserBookmark(user, uuid);
    if (isEmpty(myBookmark)) {
      throw new NotFoundException(ERROR.NOT_EXIST_DATA);
    } else await this.bookmarkQueryRepository.bookmarkDelete(myBookmark);

    return { uuid };
  }
}
