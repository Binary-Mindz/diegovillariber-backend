import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { I18nContext } from 'nestjs-i18n';
import { TranslationService } from '../services/translation.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DynamicTranslationInterceptor implements NestInterceptor {
  private readonly translatableFields = [
    'caption', 'title', 'description', 'eventTitle', 'locationName', 
    'locationAddress', 'garageName', 'message', 'notes', 'additionalNotes'
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly translationService: TranslationService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current(context);
    const lang = i18n?.lang || 'en';

    return next.handle().pipe(
      mergeMap(async (response) => {
        if (!response || lang === 'en') return response;

        if (response.data) {
          response.data = await this.translateDeep(response.data, lang, context);
        } else {
          response = await this.translateDeep(response, lang, context);
        }

        return response;
      }),
    );
  }

  private async translateDeep(data: any, lang: string, context: ExecutionContext): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((item) => this.translateDeep(item, lang, context)));
    }

    if (data !== null && typeof data === 'object') {
      if (data.id && typeof data.id === 'string') {
        const entityType = data.constructor.name === 'Object' ? this.guessEntityType(context) : data.constructor.name;

        // 🛠️ FIX 1 & 2: টাইপস্ক্রিপ্ট এরর এড়াতে এবং ডাইনামিক পাথ হিসেবে প্রিজমা কুয়েরি করা
        const prismaClient = this.prisma as any;
        if (prismaClient.translation) {
          const existingTranslations = await prismaClient.translation.findMany({
            where: { entityId: data.id, language: lang },
          });

          for (const field of this.translatableFields) {
            if (data.hasOwnProperty(field) && typeof data[field] === 'string' && data[field].trim() !== '') {
              // 🛠️ FIX 3: 't' এর টাইপ explicitly 'any' ডিফাইন করে দেওয়া
              const matchedTranslation = existingTranslations.find((t: any) => t.field === field);

              if (matchedTranslation) {
                data[field] = matchedTranslation.value;
              } else if (entityType && entityType !== 'UnknownEntity') {
                const translatedText = await this.translationService.translateText(data[field], lang);
                
                await prismaClient.translation.create({
                  data: {
                    entityType: entityType,
                    entityId: data.id,
                    field: field,
                    language: lang,
                    value: translatedText,
                  },
                }).catch(() => {});

                data[field] = translatedText;
              }
            }
          }
        }
      }

      for (const key in data) {
        if (data.hasOwnProperty(key) && typeof data[key] === 'object') {
          data[key] = await this.translateDeep(data[key], lang, context);
        }
      }
    }

    return data;
  }

  private guessEntityType(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const url = request.url.toLowerCase();
    
    if (url.includes('posts') || url.includes('discover')) return 'Post';
    if (url.includes('program') || url.includes('rawshift')) return 'Challenge';
    if (url.includes('product')) return 'ProductList';
    if (url.includes('sportting-request')) return 'SpottingRequest';
    if (url.includes('pro-profile') || url.includes('user')) return 'Profile';
    if (url.includes('property')) return 'VirtualGarage';
    if (url.includes('notification')) return 'Notification';
    
    return 'UnknownEntity';
  }
}