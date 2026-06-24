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
        if (response && response.message && i18n) {
          const translatedMessage = i18n.t(`common.${response.message}`);
          
          if (translatedMessage && !translatedMessage.startsWith('common.')) {
            response.message = translatedMessage;
          }
        }
        return response;
      }),
    );
  }
}