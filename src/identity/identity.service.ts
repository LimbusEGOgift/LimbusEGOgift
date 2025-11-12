import { Injectable } from '@nestjs/common';
import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { FindEGOGiftDto } from './dto/findEGOGift.dto';

type KeyMap = Record<string, string[]>;

@Injectable()
export class IdentityService {
  // 모든 인격 리스트 반환
  async findIdentityList(): Promise<KeyMap> {
    const result: KeyMap = {};

    const entries = await readdir('identity', { withFileTypes: true });
    await Promise.all(
      entries.map(async (ent) => {
        const p = join('identity', ent.name);
        const Sinner = await readFile(p, 'utf-8');
        const parsed = JSON.parse(Sinner);
        const Identitys = Object.keys(parsed);
        result[basename(ent.name, '.json')] = Identitys;
      }),
    );

    return result;
  }

  // 특정 인격이 적용받을 수 있는 EGOGift 반환
  async findEGOGiftForIdentity(dto: FindEGOGiftDto): Promise<KeyMap> {
    // const result: KeyMap = {};

    // 인격의 키워드를 가져옴
    const Sinner = await readFile(`identity/${dto.sinner}.json`, 'utf-8');
    const keyWord = JSON.parse(Sinner)[dto.identity]['키워드'];

    return keyWord;
  }
}
