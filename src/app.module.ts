import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { CommentModule } from 'src/comment/comment.module';
import { CommunityModule } from 'src/community/community.module';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { CourseModule } from 'src/course/course.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PlaceModule } from 'src/place/place.module';
import { ReactionModule } from 'src/reaction/reaction.module';
import { SearchModule } from 'src/search/search.module';
import { SubwayModule } from 'src/subway/subway.module';
import { ThemeModule } from 'src/theme/theme.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [`${__dirname}/entities/**.entity{.ts,.js}`],
          logging: true,
          synchronize: false,
          keepConnectionAlive: true,
          charset: 'utf8mb4',
          timezone: 'z',
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    UserModule,
    PlaceModule,
    CourseModule,
    ReactionModule,
    NotificationModule,
    AuthModule,
    SearchModule,
    ThemeModule,
    BookmarkModule,
    CommunityModule,
    SubwayModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
