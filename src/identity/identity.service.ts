import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { FindIdentityByEGOGiftDto } from './dto/findIdentityByEGOGift.dto';

type IdentityList = Record<string, string[]>;
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

@Injectable()
export class IdentityService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

  async findAllIdentity(): Promise<IdentityList> {
    const dir = path.resolve('identity');
    const files =
      await this.jsonLoader.readJsonFiles<Record<string, object>>(dir);

    const identityBySinner: IdentityList = {};
    for (const [fileName, identities] of Object.entries(files)) {
      const sinner = path.basename(fileName, path.extname(fileName));
      identityBySinner[sinner] = Object.keys(identities);
    }

    return identityBySinner;
  }

  async findMatchedEGOGifts(
    dto: FindIdentityByEGOGiftDto,
  ): Promise<Record<string, EGOGiftCollection>> {
    const sinnerFilePath = path.resolve(`identity/${dto.sinner}.json`);
    const identities =
      await this.jsonLoader.readSingleJson<IdentityCollection>(sinnerFilePath);

    const identityDetail = identities[dto.identity];
    if (!identityDetail) {
      throw new NotFoundException(
        `Identity "${dto.identity}" not found for sinner "${dto.sinner}"`,
      );
    }

    const keywords = Array.isArray(identityDetail['키워드'])
      ? identityDetail['키워드']
      : [];

    const giftDir = path.resolve('EGOGift');
    const giftFiles =
      await this.jsonLoader.readJsonFiles<EGOGiftCollection>(giftDir);

    const matchedGifts: Record<string, EGOGiftCollection> = {};

    for (const [fileName, gifts] of Object.entries(giftFiles)) {
      const category = path.basename(fileName, path.extname(fileName));

      const hasOverlap = Object.values(gifts).some((gift) => {
        const conditions = Array.isArray(gift['조건']) ? gift['조건'] : [];
        return conditions.some((condition) => keywords.includes(condition));
      });

      if (hasOverlap) {
        matchedGifts[category] = gifts;
      }
    }

    return matchedGifts;
  }
}
