import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { JsonLoaderService } from 'src/utils/json-loader.service';

type IdentityDetail = {
  Trait: string[];
  Keyword: string[];
  Skill1: string[];
  Skill2: string[];
  Skill3: string[];
};
export type IdentityCollection = Record<string, IdentityDetail>;

@Injectable()
export class IdentityService {
  constructor(private readonly jsonLoader: JsonLoaderService) {}

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
}
