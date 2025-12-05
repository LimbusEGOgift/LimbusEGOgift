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
type EGOGiftDetail = EGOGiftCollection[keyof EGOGiftCollection];

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
  ): Promise<Record<string, EGOGiftCollection>> {
    // DTO에서 전달된 비교 대상(특성, 키워드, 스킬)만 추출
    const comparableFields = comparableKeys
      .map((key) => {
        const value = dto[key];
        return Array.isArray(value) && value.length > 0 ? [key, value] : null;
      })
      .filter((entry): entry is [ComparableKey, string[]] => entry !== null);

    const formationCriterion =
      typeof dto.Formation === 'number' ? dto.Formation : null;

    if (formationCriterion === null || comparableFields.length === 0) {
      return {};
    }

    // 입력된 조건과 교집합이 발생한 요소에 "*"을 붙여 표시
    const criteriaByKey = new Map<ComparableKey, string[]>(comparableFields);
    const highlightMatches = (
      values: string[] | undefined,
      key: ComparableKey,
    ): string[] => {
      const source = Array.isArray(values) ? values : [];
      const criteria = criteriaByKey.get(key);

      if (!criteria || criteria.length === 0) {
        return [...source];
      }

      return source.map((value) =>
        criteria.includes(value) ? `${value}*` : value,
      );
    };

    const giftDir = path.resolve('EGOGift');
    const giftFiles =
      await this.jsonLoader.readJsonFiles<EGOGiftCollection>(giftDir);

    const matchedGifts: Record<string, EGOGiftCollection> = {};

    for (const [fileName, gifts] of Object.entries(giftFiles)) {
      const category = path.basename(fileName, path.extname(fileName));

      const matchedGiftDetails: EGOGiftCollection = {};

      for (const [giftName, gift] of Object.entries(gifts)) {
        // 편성 정보(Formation)은 교집합이 있거나 빈 배열이여야 함
        const giftFormation = Array.isArray(gift.Formation)
          ? gift.Formation
          : [];
        const matchesFormation =
          giftFormation.length === 0 ||
          giftFormation.includes(formationCriterion);

        if (!matchesFormation) {
          continue;
        }

        // 편성 정보(Formation)을 제외한 나머지 조건에 교집합이 발생하는지 확인 -> 교집합이 생겨야 통과
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

        // 교집합 요소에 '*'를 달아 상세 정보와 함께 저장
        const highlightedGift: EGOGiftDetail = {
          ...gift,
          Trait: highlightMatches(gift.Trait, 'Trait'),
          Keyword: highlightMatches(gift.Keyword, 'Keyword'),
          Skill1: highlightMatches(gift.Skill1, 'Skill1'),
          Skill2: highlightMatches(gift.Skill2, 'Skill2'),
          Skill3: highlightMatches(gift.Skill3, 'Skill3'),
          Formation: [...giftFormation],
          Recipe: Array.isArray(gift.Recipe) ? [...gift.Recipe] : [],
          ThemePack: Array.isArray(gift.ThemePack) ? [...gift.ThemePack] : [],
          Effect: gift.Effect,
        };

        matchedGiftDetails[giftName] = highlightedGift;
      }

      if (Object.keys(matchedGiftDetails).length > 0) {
        matchedGifts[category] = matchedGiftDetails;
      }
    }

    return matchedGifts;
  }
}
