import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { FindIdentityByEGOGiftDto } from './dto/findIdentityByCondition.dto';
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
export class EgogiftService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

  async findAllEGOGift(): Promise<Record<string, EGOGiftCollection>> {
    const dir = path.resolve('EGOGift');
    const files = await this.jsonLoader.readJsonFiles<EGOGiftCollection>(dir);

    const giftsByCategory: Record<string, EGOGiftCollection> = {};

    for (const [fileName, gifts] of Object.entries(files)) {
      const category = path.basename(fileName, path.extname(fileName));
      giftsByCategory[category] = gifts;
    }

    return giftsByCategory;
  }

  async findMatchedIdentities(
    dto: FindIdentityByEGOGiftDto,
  ): Promise<Record<string, string[]>> {
    const comparableFields = comparableKeys
      .map((key) => {
        const value = dto[key];
        return Array.isArray(value) && value.length > 0 ? [key, value] : null;
      })
      .filter((entry): entry is [ComparableKey, string[]] => entry !== null);

    if (comparableFields.length === 0) {
      return {};
    }

    const identityDir = path.resolve('identity');
    const sinners =
      await this.jsonLoader.readJsonFiles<IdentityCollection>(identityDir);

    const matched: Record<string, string[]> = {};

    for (const [fileName, identities] of Object.entries(sinners)) {
      const sinner = path.basename(fileName, path.extname(fileName));
      const identityNames: string[] = [];

      for (const [identityName, identityDetail] of Object.entries(identities)) {
        const hasOverlap = comparableFields.some(([key, values]) => {
          const identityValues = Array.isArray(identityDetail[key])
            ? identityDetail[key]
            : [];
          return identityValues.some((identityValue) =>
            values.includes(identityValue),
          );
        });

        if (hasOverlap) {
          identityNames.push(identityName);
        }
      }

      const uniqueIdentityNames = Array.from(new Set(identityNames));

      if (uniqueIdentityNames.length > 0) {
        matched[sinner] = uniqueIdentityNames;
      }
    }

    return matched;
  }
}
