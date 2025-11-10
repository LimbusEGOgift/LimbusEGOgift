export interface identityInterface {
  // 인격 이름
  name: string;
  // 소속
  trait: string[];
  // 키워드
  keyWord: KeyWord[];
  // [1, 2, 3(, 4)] 스킬의 코인 수
  coinNum: number[];
  // [1, 2, 3(, 4)] 스킬의 죄악 속성
  affinity: Affinity[];
  // [1, 2, 3(, 4)] 스킬의 공격 유형
  type: Type[];
  // 스킬 중 최대 가중치
  maxWeight: number;
  // 스킬 중 최소 가중치
  minWeight: number;
  // 기타 조건들
  other: Other[];
}

// 분노, 색욕, 나태, 탐식, 우울, 오만, 질투
type Affinity =
  | 'Wrath'
  | 'Lust'
  | 'Sloth'
  | 'Glut'
  | 'Gloom'
  | 'Pride'
  | 'Envy';
// 참격, 관통, 타격
type Type = 'Slash' | 'Pierce' | 'Blunt';

type KeyWord =
  // 화상
  | 'Burn'
  // 출혈
  | 'Bleed'
  // 진동
  | 'Tremor'
  // 파열
  | 'Rupture'
  // 침잠
  | 'Sniking'
  // 호흡
  | 'Poise'
  // 충전
  | 'Charge'
  // 탄환
  | 'Ammo'
  // 혈찬
  | 'BloodFeast';

type Other =
  // 더하기 코인 사용
  | 'plusCoin'
  // 빼기 코인 사용
  | 'minusCoin'
  // 단일 코인 재사용 가능
  | 'oneCoinReuse'
  // 파괴 불가 코인 사용
  | 'unbreakableCoin'
  // 스킬 효과로 정신력 회복 가능
  | 'mentalUp'
  // 스킬 효과로 정신력 감소 가능
  | 'mentalDown'
  // 스킬 효과로 스킬 버림 가능
  | 'skillDrop';
