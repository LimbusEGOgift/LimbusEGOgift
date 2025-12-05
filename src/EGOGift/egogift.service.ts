import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import { EGOGiftCollection } from 'src/common/type/identity-EGOGift.type';

@Injectable()
export class EgogiftService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

  // 모든 EGOGift의 정보를 반환
  async findAllEGOGift(): Promise<Record<string, EGOGiftCollection>> {
    // 모든 EGOGift 파일(.json)을 로드
    const dir = path.resolve('EGOGift');
    const files = await this.jsonLoader.readJsonFiles<EGOGiftCollection>(dir);

    const giftsByCategory: Record<string, EGOGiftCollection> = {};
    // 파일을 카테고리와 EGOGift 정보로 나누어 {"<카테고리>" : {<EGOGift 정보>}} 형태로 반환
    for (const [fileName, gifts] of Object.entries(files)) {
      const category = path.basename(fileName, path.extname(fileName));
      giftsByCategory[category] = gifts;
    }

    return giftsByCategory;
  }
}
