import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { FindEGOGiftByKeywordDto } from './dto/findEGOGiftByKeyword.dto';
import {
  EGOGiftCollection,
  IdentityCollection,
} from 'src/common/type/identity-EGOGift.type';

@Injectable()
export class IdentityService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

  async findAllIdentity(): Promise<Record<string, IdentityCollection>> {
    const dir = path.resolve('identity');
    const files = await this.jsonLoader.readJsonFiles<IdentityCollection>(dir);

    const identityBySinner: Record<string, IdentityCollection> = {};
    for (const [fileName, identityDetail] of Object.entries(files)) {
      const sinner = path.basename(fileName, path.extname(fileName));
      identityBySinner[sinner] = identityDetail;
    }

    return identityBySinner;
  }

  async findMatchedEGOGifts(
    dto: FindEGOGiftByKeywordDto,
  ): Promise<Record<string, string[]>> {
    const keywords = Array.isArray(dto.KeyWord) ? dto.KeyWord : [];

    const giftDir = path.resolve('EGOGift');
    const giftFiles =
      await this.jsonLoader.readJsonFiles<EGOGiftCollection>(giftDir);

    const matchedGifts: Record<string, string[]> = {};

    for (const [fileName, gifts] of Object.entries(giftFiles)) {
      const category = path.basename(fileName, path.extname(fileName));

      const matchedGiftNames: string[] = [];

      for (const [giftName, gift] of Object.entries(gifts)) {
        const conditions = Array.isArray(gift['조건']) ? gift['조건'] : [];
        const hasOverlap = conditions.some((condition) =>
          keywords.includes(condition),
        );

        if (hasOverlap) {
          matchedGiftNames.push(giftName);
        }
      }

      if (matchedGiftNames.length > 0) {
        matchedGifts[category] = matchedGiftNames;
      }
    }

    return matchedGifts;
  }
}
