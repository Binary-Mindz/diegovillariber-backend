import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current(context);

    return next.handle().pipe(
      map((response) => {
        // মেসেজটি স্ট্রিং কি না তা নিশ্চিত করা এবং ট্রিম (Trim) করা
        if (response && response.message && typeof response.message === 'string' && i18n) {
          const cleanMessage = response.message.trim();
          const translatedMessage = i18n.t(`common.${cleanMessage}`);
          
          if (translatedMessage && !translatedMessage.startsWith('common.')) {
            response.message = translatedMessage;
          }
        }
        return response;
      }),
    );
  }
}