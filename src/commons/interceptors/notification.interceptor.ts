import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationPushDto } from 'src/notification/dto/notification.dto';
import { NotificationQueryRepository } from 'src/notification/notification.query.repository';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(private readonly notificationQueryRepository: NotificationQueryRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async () => {
        const { notification } = request;
        if (!notification || notification.user_uuid === notification.target_user_uuid) {
          return;
        }

        const notificationData = new NotificationPushDto({
          uuid: notification.uuid,
          user_uuid: notification.user_uuid,
          target_type: notification.target_type,
          target_uuid: notification.target_uuid,
          target_user_uuid: notification.target_user_uuid,
          content: notification.content,
        });

        await this.notificationQueryRepository.sendNotification(notificationData);
      }),
    );
  }
}
