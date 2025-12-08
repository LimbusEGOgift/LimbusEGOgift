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
  constructor(private readonly jsonLoader: JsonLoaderService) { }

  // 모든 인격 정보들을 반환
  async findAllIdentity(): Promise<Record<string, IdentityCollection>> {
    // identity 폴더에 있는 모든 json 파일을 읽어옴
    const dir = path.resolve('identity');
    const files = await this.jsonLoader.readJsonFiles<IdentityCollection>(dir);

    const identityBySinner: Record<string, IdentityCollection> = {};
    // 파일을 수감자 이름과 인격 정보로 나누어 {"<수감자 이름>" : {<인격 정보>}} 형태로 반환
    // 읽어온 json 파일들을 filename과 파일 내용으로 분리 -> 인격들을 수감자(filename)별로 구분해 반환
    for (const [fileName, identityDetail] of Object.entries(files)) {
      const sinner = path.basename(fileName, path.extname(fileName));
      identityBySinner[sinner] = identityDetail;
    }

    return identityBySinner;
  }

  // 입력된 조건(dto -> 인격(들)의 조건)과 교집합이 하나라도 발생하는 EGOGift들을 반환
  // 편성 정보는 교집합이 생기거나 EGOGift의 조건에 편성 정보가 빈 배열이여야 함
  // 편성 정보에 교집합이 생기더라도 나머지 조건에 교집합이 생기지 않는다면 반환하지 않음
  // 조건을 만족한다면 교집합이 생기는 EGOGift의 조건 맨 뒤에 "*"을 붙여 표시
  // 받은 조건(FileEGOGiftByIdentityDto)와 교집합이 하나라도 생기는 EGOGift를 반환
  // 단, 교집합 비교 시 같은 이름 끼리 비교(EX: keyword <-> keyword, skill1 <-> skill1)
  async findMatchedEGOGifts(
    dto: FindEGOGiftByIdentityDto,
  ): Promise<Record<string, EGOGiftCollection>> {
    // 들어온 조건들을 map으로 묶어 저장
    const comparableFields = comparableKeys
      .map((key) => {
        const value = dto[key];
        return Array.isArray(value) && value.length > 0 ? [key, value] : null;
      })
      .filter((entry): entry is [ComparableKey, string[]] => entry !== null);

    // 편성 정보 저장
    const formationCriterion =
      typeof dto.Formation === 'number' ? dto.Formation : null;

    if (formationCriterion === null || comparableFields.length === 0) {
      return {};
    }
    // 입력된 조건과 교집합이 발생한 요소에 "*"을 붙여 표시하는 헬퍼
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
    // 모든 EGOGift를 가져옴
    const giftDir = path.resolve('EGOGift');
    const giftFiles =
      await this.jsonLoader.readJsonFiles<EGOGiftCollection>(giftDir);

    const matchedGifts: Record<string, EGOGiftCollection> = {};

    // 읽어온 json 파일을 filename과 파일 내용으로 분리 -> EGOGift 카테고리(filename)별로 구분해 반환
    for (const [fileName, gifts] of Object.entries(giftFiles)) {
      const category = path.basename(fileName, path.extname(fileName));

      const matchedGiftDetails: EGOGiftCollection = {};

      // 각 EGOGift들을 giftname과 gift(각 gift의 조건)로 분리
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
        // 받은 조건과 gift의 조건에서 하나라도 교집합이 만들어지는지 확인
        const hasComparableOverlap =
          comparableFields.length > 0
            ? comparableFields.some(([key, values]) => {
              const giftValues = Array.isArray(gift[key]) ? gift[key] : [];
              return giftValues.some((giftValue) =>
                values.includes(giftValue),
              );
            })
            : true;

        // 교집합이 없다면 continue
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
