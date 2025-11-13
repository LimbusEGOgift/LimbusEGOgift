import { Injectable } from '@nestjs/common';
import { JsonLoaderService } from 'src/utils/json-loader.service';
import * as path from 'path';
import { FindEGOGiftDto } from './dto/findEGOGift.dto';

type KeyMap = Record<string, string[]>;

@Injectable()
export class IdentityService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

  async findIdentityList(): Promise<KeyMap> {
    const dir = path.resolve('identity');
    const files = await this.jsonLoader.readJsonFiles<Record<string, any>>(dir);

    const allNames: KeyMap = {};
    for (const sinner of Object.keys(files)) {
      for (const data of Object.values(files)) {
        const identity = Object.keys(data);
        allNames[path.basename(sinner, '.json')] = identity;
      }
    }

    return allNames;
  }

  async findEGOGiftForIdentity(dto: FindEGOGiftDto): Promise<Record<string, KeyMap>> {
    const sinnerDir = path.resolve(`identity/${dto.sinner}.json`);
    const identity = await this.jsonLoader.readSingleJson<Record<string, any>>(sinnerDir);
    const keyWords = new Set(identity[dto.identity]["키워드"]);

    const EGOGiftDir = path.resolve('EGOGift');
    const files = await this.jsonLoader.readJsonFiles<Record<string, any>>(EGOGiftDir);

    const allNames: Record<string, KeyMap> = {};
    for(const category of Object.keys(files)){
      for(const EGOGift of Object.values(files)){
        for(const data of Object.values(EGOGift)){
          const condition: string[] = data["조건"];
          const check = condition.filter(x => keyWords.has(x));
          if(check.length) allNames[path.basename(category, '.json')] = EGOGift;
        }
      }
    }

    return allNames;
  }
}
