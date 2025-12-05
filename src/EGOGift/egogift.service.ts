import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import {
  EGOGiftCollection,
} from 'src/common/type/identity-EGOGift.type';

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
}
