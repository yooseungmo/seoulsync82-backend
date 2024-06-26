import { InjectRepository } from '@nestjs/typeorm';
import { CommunityEntity } from 'src/entities/community.entity';
import { IsNull, LessThan, Repository } from 'typeorm';
import { ApiCommunityGetRequestQueryDto } from './dto/api-community-get-request-query.dto';

export class CommunityQueryRepository {
  constructor(
    @InjectRepository(CommunityEntity)
    private repository: Repository<CommunityEntity>,
  ) {}

  async save(communityEntity) {
    return await this.repository.save(communityEntity);
  }

  async find(dto: ApiCommunityGetRequestQueryDto): Promise<CommunityEntity[]> {
    const whereConditions = { archived_at: IsNull() };

    if (dto.last_id > 0) {
      Object.assign(whereConditions, { id: LessThan(dto.last_id) });
    }

    return await this.repository.find({
      where: whereConditions,
      order: { created_at: 'DESC' },
      take: dto.size,
    });
  }

  async findMyCommunity(dto: ApiCommunityGetRequestQueryDto, user): Promise<CommunityEntity[]> {
    const whereConditions = { user_uuid: user.uuid, archived_at: IsNull() };

    if (dto.last_id > 0) {
      Object.assign(whereConditions, { id: LessThan(dto.last_id) });
    }

    return await this.repository.find({
      where: whereConditions,
      order: { created_at: 'DESC' },
      take: dto.size,
    });
  }

  async findOne(uuid): Promise<CommunityEntity> {
    return await this.repository.findOne({
      where: { uuid: uuid, archived_at: IsNull() },
    });
  }

  async myCommunity(user): Promise<CommunityEntity[]> {
    return await this.repository.find({
      where: { user_uuid: user.uuid, archived_at: IsNull() },
      order: { created_at: 'DESC' },
    });
  }

  async findCommunityByCourse(uuid, user): Promise<CommunityEntity> {
    return await this.repository.findOne({
      where: { course_uuid: uuid, user_uuid: user.uuid, archived_at: IsNull() },
    });
  }
}
