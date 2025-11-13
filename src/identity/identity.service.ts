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
        const identities = Object.keys(data);
        allNames[path.basename(sinner, '.json')] = identities;
      }
    }

    return allNames;
  }

  async findEGOGiftForIdentity(dto: FindEGOGiftDto) {}
}
