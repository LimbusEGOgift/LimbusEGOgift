import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { FindEGOGiftByIdentityDto } from './dto/findEGOGiftByIdentity.dto';

type EGOGiftMap = Record<string, string[]>;
type IdentityData = Record<string, any>;
type MatchedIdentityMap = Record<string, IdentityData>;

@Injectable()
export class EgogiftService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

  async findAllEGOGift(): Promise<EGOGiftMap> {
    const dir = path.resolve('EGOGift');
    const files =
      await this.jsonLoader.readJsonFiles<Record<string, object>>(dir);

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
      await this.jsonLoader.readSingleJson<Record<string, any>>(giftFilePath);

    const giftDetail = giftData[dto.EGOGift];
    if (!giftDetail) {
      throw new NotFoundException(
        `EGOGift "${dto.EGOGift}" not found in category "${dto.Category}"`,
      );
    }

    const conditions = Array.isArray(giftDetail['조건'])
      ? (giftDetail['조건'] as string[])
      : [];

    const identityDir = path.resolve('identity');
    const sinners =
      await this.jsonLoader.readJsonFiles<Record<string, IdentityData>>(
        identityDir,
      );

    const matched: MatchedIdentityMap = {};

    for (const [fileName, identities] of Object.entries(sinners)) {
      const sinner = path.basename(fileName, path.extname(fileName));

      for (const [identityName, identityDetail] of Object.entries(identities)) {
        const keywords = Array.isArray(identityDetail['키워드'])
          ? (identityDetail['키워드'] as string[])
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
