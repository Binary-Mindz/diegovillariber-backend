import { Injectable, Logger } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  async translateText(text: string, targetLang: string = 'es'): Promise<string> {
    if (!text || text.trim() === '') return text;
    
    try {
      // গুগল ট্রান্সলেট এপিআই কল (অটোমেটিক সোর্স ল্যাঙ্গুয়েজ ডিটেক্ট করবে)
      const res = await translate(text, { to: targetLang });
      return res.text;
    } catch (error) {
      this.logger.error(`Translation failed for text: ${text}`, error);
      return text; // কোনো কারণে এপিআই ফেইল করলে অরিজিনাল ইংলিশ টেক্সটই ব্যাক করবে যেন অ্যাপ ক্র্যাশ না হয়
    }
  }
}