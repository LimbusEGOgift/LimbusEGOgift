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
  constructor(private readonly jsonLoader: JsonLoaderService) { }

  // 모든 인격 반환
  async findAllIdentity(): Promise<Record<string, IdentityCollection>> {
    // identity 폴더에 있는 모든 json 파일을 읽어옴
    const dir = path.resolve('identity');
    const files = await this.jsonLoader.readJsonFiles<IdentityCollection>(dir);

    const identityBySinner: Record<string, IdentityCollection> = {};
    // 읽어온 json 파일들을 filename과 파일 내용으로 분리 -> 인격들을 수감자(filename)별로 구분해 반환
    for (const [fileName, identityDetail] of Object.entries(files)) {
      const sinner = path.basename(fileName, path.extname(fileName));
      identityBySinner[sinner] = identityDetail;
    }

    return identityBySinner;
  }

  // 받은 조건(FileEGOGiftByIdentityDto)와 교집합이 하나라도 생기는 EGOGift를 반환
  // 단, 교집합 비교 시 같은 이름 끼리 비교(EX: keyword <-> keyword, skill1 <-> skill1)
  async findMatchedEGOGifts(
    dto: FindEGOGiftByIdentityDto,
  ): Promise<Record<string, string[]>> {
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

    if (comparableFields.length === 0 && formationCriterion === null) {
      return {};
    }

    // 모든 EGOGift를 가져옴
    const giftDir = path.resolve('EGOGift');
    const giftFiles =
      await this.jsonLoader.readJsonFiles<EGOGiftCollection>(giftDir);

    const matchedGifts: Record<string, string[]> = {};

    // 읽어온 json 파일을 filename과 파일 내용으로 분리 -> EGOGift 카테고리(filename)별로 구분해 반환
    for (const [fileName, gifts] of Object.entries(giftFiles)) {
      const category = path.basename(fileName, path.extname(fileName));

      const matchedGiftNames: string[] = [];

      // 각 EGOGift들을 giftname과 gift(각 gift의 조건)로 분리
      for (const [giftName, gift] of Object.entries(gifts)) {
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

        // 편성 정보 확인
        // gift의 편성 정보는 받은 편성 정보를 포함하거나, 빈 배열이여야 함
        // 즉, 교집합이 만들어 지거나 gift의 Formation 조건이 비어 있어야 함
        let matchesFormation = true;
        if (formationCriterion !== null) {
          const giftFormation = Array.isArray(gift.Formation)
            ? gift.Formation
            : [];
          matchesFormation =
            giftFormation.length === 0 ||
            giftFormation.includes(formationCriterion);
        }

        // 조건에 맞지 않으면 continue
        if (!matchesFormation) {
          continue;
        }

        // 조건에 전부 부합한다면 giftname만 반환 객체에 추가
        matchedGiftNames.push(giftName);
      }

      // 조건에 맞는 gift가 있는 가테고리라면 답변에 추가
      if (matchedGiftNames.length > 0) {
        matchedGifts[category] = matchedGiftNames;
      }
    }

    return matchedGifts;
  }
}
