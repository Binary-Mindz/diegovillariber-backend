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
    ) { }

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
                                }).catch(() => { });

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

        if (url.includes('post-rating') || url.includes('rating')) return 'PostRating';
        if (url.includes('repost')) return 'Repost';
        if (url.includes('save-post')) return 'SavePost';
        if (url.includes('posts') || url.includes('discover') || url.includes('feed')) return 'Post';
        if (url.includes('car-story')) return 'CarStory';
        if (url.includes('car-milestone')) return 'CarMilestone';
        if (url.includes('comment')) return 'Comment';
        if (url.includes('like')) return 'Like';

        // 2. Program, Battles & Challenges (RawShift, H2H, SplitScreen)
        if (url.includes('rawshift-battle') || url.includes('rawshift')) return 'RawShiftBattle';
        if (url.includes('rawshift-entry')) return 'RawShiftEntry';
        if (url.includes('rawshift-comment')) return 'RawShiftComment';

        if (url.includes('splitscreen-match') || url.includes('match-request')) return 'SplitScreenMatchRequest';
        if (url.includes('splitscreen-battle') || url.includes('splitscreen')) return 'SplitScreenBattle';

        if (url.includes('challenge') || url.includes('program')) return 'Challenge';
        if (url.includes('head-to-head') || url.includes('h2h') || url.includes('battle')) return 'HeadToHeadBattle';

        // 3. Marketplace & Products
        if (url.includes('wishlist')) return 'WishList';
        if (url.includes('product') || url.includes('marketplace')) return 'ProductList';

        // 4. Profiles & Racing Modules
        if (url.includes('pro-driver') || url.includes('pro-profile')) return 'ProDriverProfile';
        if (url.includes('sim-racing') || url.includes('simracing')) return 'SimRacingProfile';
        if (url.includes('spotter-profile')) return 'SpotterProfile';
        if (url.includes('profile') || url.includes('user')) return 'Profile';

        // 5. Racing, Votes & Telemetry
        if (url.includes('racing-vote')) return 'RacingVote';
        if (url.includes('racing')) return 'Racing';
        if (url.includes('submit-lap-time') || url.includes('labtime') || url.includes('laptime')) return 'SubmitLabTime';
        if (url.includes('setup-description')) return 'SetupDescriptionPhoto';

        // 6. Spotting Module
        if (url.includes('spotting-match')) return 'SpottingMatch';
        if (url.includes('sportting-request') || url.includes('spotting-request')) return 'SpottingRequest';

        // 7. Garage, Cars & Tuning (Advanced Car Data)
        if (url.includes('virtual-garage')) return 'VirtualGarage';
        if (url.includes('virtual-event') || url.includes('sim-event')) return 'VirtualSimRacingEvent';
        if (url.includes('garage')) return 'Garage';
        if (url.includes('car')) return 'Car';
        if (url.includes('bike')) return 'Bike';
        if (url.includes('tuning') || url.includes('tuning-aero')) return 'TuningAero';
        if (url.includes('wheels-tires')) return 'WheelsTires';
        if (url.includes('usage-notes')) return 'UsageNotes';

        // 8. System, Gamification & Tutorials
        if (url.includes('prestige-rule') || url.includes('prestige')) return 'PrestigeRule';
        if (url.includes('prize')) return 'Prize';
        if (url.includes('tutorial')) return 'Tutorial';
        if (url.includes('user-point') || url.includes('points')) return 'UserPoint';
        if (url.includes('notification')) return 'Notification';
        if (url.includes('report')) return 'Report';
        if (url.includes('chat') || url.includes('message')) return 'Message';

        return 'UnknownEntity';
    }
}