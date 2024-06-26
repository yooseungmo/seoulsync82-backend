import { InjectRepository } from '@nestjs/typeorm';
import { ReactionEntity } from 'src/entities/reaction.entity';
import { Repository, In } from 'typeorm';

export class ReactionQueryRepository {
  constructor(
    @InjectRepository(ReactionEntity)
    private repository: Repository<ReactionEntity>,
  ) {}

  async findOne(uuid, user): Promise<ReactionEntity> {
    return await this.repository.findOne({
      where: { target_uuid: uuid, user_uuid: user.uuid },
    });
  }

  async courseLike(reaction): Promise<ReactionEntity> {
    return await this.repository.save(reaction);
  }

  async updateCourseLike(reaction) {
    return await this.repository.update({ id: reaction.id }, { like: 1 });
  }

  async updateCourseLikeDelete(reaction) {
    return await this.repository.update({ id: reaction.id }, { like: 0 });
  }

  async findCommunityReaction(uuids): Promise<ReactionEntity[]> {
    return await this.repository.find({ where: { target_uuid: In(uuids), like: 1 } });
  }

  async findCommunityDetailReaction(uuid): Promise<ReactionEntity[]> {
    return await this.repository.find({ where: { target_uuid: uuid, like: 1 } });
  }
}
