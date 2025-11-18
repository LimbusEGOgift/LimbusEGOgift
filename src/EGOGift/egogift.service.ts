import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { FindIdentityByConditionDto } from './dto/findIdentityByCondition.dto';
import { EGOGiftCollection, IdentityCollection } from 'src/common/type/identity-EGOGift.type';

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
    dto: FindIdentityByConditionDto,
  ): Promise<Record<string, string[]>> {
    const conditions = Array.isArray(dto.Condition) ? dto.Condition : [];

    const identityDir = path.resolve('identity');
    const sinners =
      await this.jsonLoader.readJsonFiles<IdentityCollection>(identityDir);

    const matched: Record<string, string[]> = {};

    for (const [fileName, identities] of Object.entries(sinners)) {
      const sinner = path.basename(fileName, path.extname(fileName));
      const identityNames: string[] = [];

      for (const [identityName, identityDetail] of Object.entries(identities)) {
        const keywords = Array.isArray(identityDetail['키워드'])
          ? identityDetail['키워드']
          : [];
        const hasOverlap = keywords.some((kw) => conditions.includes(kw));

        if (hasOverlap) {
          identityNames.push(identityName);
        }
      }

      if (identityNames.length > 0) {
        matched[sinner] = identityNames;
      }
    }

    return matched;
  }
}
