import { InjectRepository } from '@nestjs/typeorm';
import { MyCourseEntity } from 'src/entities/my_course.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { IsNull, LessThan, Repository, In } from 'typeorm';

export class NotificationQueryRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private repository: Repository<NotificationEntity>,
  ) {}

  async sendNotification(notificationData): Promise<NotificationEntity> {
    return await this.repository.save(notificationData);
  }

  async findList(dto, user): Promise<NotificationEntity[]> {
    const whereConditions = { target_user_uuid: user.uuid };

    if (dto.last_id > 0) {
      Object.assign(whereConditions, { id: LessThan(dto.last_id) });
    }

    return await this.repository.find({
      where: whereConditions,
      order: { created_at: 'DESC' },
      take: dto.size,
    });
  }
}
