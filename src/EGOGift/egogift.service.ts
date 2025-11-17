import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { FindEGOGiftByIdentityDto } from './dto/findEGOGiftByIdentity.dto';

type EGOGiftMap = Record<string, string[]>;
type EGOGiftDetail = {
  조건?: string[];
  [key: string]: unknown;
};
type EGOGiftCollection = Record<string, EGOGiftDetail>;
type IdentityDetail = {
  키워드?: string[];
  [key: string]: unknown;
};
type IdentityCollection = Record<string, IdentityDetail>;
type MatchedIdentityMap = Record<string, IdentityCollection>;

@Injectable()
export class EgogiftService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

  async findAllEGOGift(): Promise<EGOGiftMap> {
    const dir = path.resolve('EGOGift');
    const files = await this.jsonLoader.readJsonFiles<EGOGiftCollection>(dir);

    const giftsByCategory: EGOGiftMap = {};

    for (const [fileName, gifts] of Object.entries(files)) {
      const category = path.basename(fileName, path.extname(fileName));
      giftsByCategory[category] = Object.keys(gifts);
    }

    return giftsByCategory;
  }

  async findMatchedIdentities(
    dto: FindEGOGiftByIdentityDto,
  ): Promise<MatchedIdentityMap> {
    const giftFilePath = path.resolve(`EGOGift/${dto.Category}.json`);
    const giftData =
      await this.jsonLoader.readSingleJson<EGOGiftCollection>(giftFilePath);

    const giftDetail = giftData[dto.EGOGift];
    if (!giftDetail) {
      throw new NotFoundException(
        `EGOGift "${dto.EGOGift}" not found in category "${dto.Category}"`,
      );
    }

    const conditions = Array.isArray(giftDetail?.['조건'])
      ? giftDetail['조건']
      : [];

    const identityDir = path.resolve('identity');
    const sinners =
      await this.jsonLoader.readJsonFiles<IdentityCollection>(identityDir);

    const matched: MatchedIdentityMap = {};

    for (const [fileName, identities] of Object.entries(sinners)) {
      const sinner = path.basename(fileName, path.extname(fileName));

      for (const [identityName, identityDetail] of Object.entries(identities)) {
        const keywords = Array.isArray(identityDetail['키워드'])
          ? identityDetail['키워드']
          : [];
        const hasOverlap = keywords.some((kw) => conditions.includes(kw));

        if (hasOverlap) {
          if (!matched[sinner]) matched[sinner] = {};
          matched[sinner][identityName] = identityDetail;
        }
      }
    }

    return matched;
  }
}
