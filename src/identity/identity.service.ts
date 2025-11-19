import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { FindEGOGiftByIdentityDto } from './dto/findEGOGiftByKeyword.dto';
import {
  EGOGiftCollection,
  IdentityCollection,
} from 'src/common/type/identity-EGOGift.type';

const comparableKeys = [
  'Trait',
  'Keyword',
  'Skill1',
  'Skill2',
  'Skill3',
] as const;
type ComparableKey = (typeof comparableKeys)[number];

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
    dto: FindEGOGiftByIdentityDto,
  ): Promise<Record<string, string[]>> {
    const comparableFields = comparableKeys
      .map((key) => {
        const value = dto[key];
        return Array.isArray(value) && value.length > 0 ? [key, value] : null;
      })
      .filter((entry): entry is [ComparableKey, string[]] => entry !== null);

    const formationCriterion =
      typeof dto.Formation === 'number' ? dto.Formation : null;

    if (comparableFields.length === 0 && formationCriterion === null) {
      return {};
    }

    const giftDir = path.resolve('EGOGift');
    const giftFiles =
      await this.jsonLoader.readJsonFiles<EGOGiftCollection>(giftDir);

    const matchedGifts: Record<string, string[]> = {};

    for (const [fileName, gifts] of Object.entries(giftFiles)) {
      const category = path.basename(fileName, path.extname(fileName));

      const matchedGiftNames: string[] = [];

      for (const [giftName, gift] of Object.entries(gifts)) {
        const hasComparableOverlap =
          comparableFields.length > 0
            ? comparableFields.some(([key, values]) => {
                const giftValues = Array.isArray(gift[key]) ? gift[key] : [];
                return giftValues.some((giftValue) =>
                  values.includes(giftValue),
                );
              })
            : true;

        if (!hasComparableOverlap) {
          continue;
        }

        let matchesFormation = true;
        if (formationCriterion !== null) {
          const giftFormation = Array.isArray(gift.Formation)
            ? gift.Formation
            : [];
          matchesFormation =
            giftFormation.length === 0 ||
            giftFormation.includes(formationCriterion);
        }

        if (!matchesFormation) {
          continue;
        }

        matchedGiftNames.push(giftName);
      }

      const uniqueMatchedGiftNames = Array.from(new Set(matchedGiftNames));

      if (uniqueMatchedGiftNames.length > 0) {
        matchedGifts[category] = uniqueMatchedGiftNames;
      }
    }

    return matchedGifts;
  }
}
