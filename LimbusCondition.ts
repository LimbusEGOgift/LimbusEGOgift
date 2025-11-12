export type Affinity =
  // 분노
  | 'Wrath'
  // 색욕
  | 'Lust'
  // 나태
  | 'Sloth'
  // 탐식
  | 'Glut'
  // 우울
  | 'Gloom'
  // 오만
  | 'Pride'
  // 질투
  | 'Envy';

// 참격, 관통, 타격
export type AttackType = 'Slash' | 'Pierce' | 'Blunt';

export type KeyWord =
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

export type Coin =
  // 더하기 코인 사용
  | 'plusCoin'
  // 빼기 코인 사용
  | 'minusCoin'
  // 단일 코인 재사용 가능
  | 'oneCoinReuse'
  // 파괴 불가 코인 사용
  | 'unbreakableCoin';

export type Skill =
  // 스킬 효과로 정신력 회복 가능
  | 'mentalUp'
  // 스킬 효과로 정신력 감소 가능
  | 'mentalDown'
  // 스킬 효과로 스킬 버림 가능
  | 'skillDrop';

export type Forming =
  // 5인 이상
  | '5Sinners'
  // 3인 이상
  | '3Sinners';

export type Trait =
  // 림버스 컴퍼니
  | 'LimbusCompany'
  // LCB
  | 'LCB'
  // LCE
  | 'LCE'
  // 해결사
  | 'Fixer'
  // 세븐 협회
  | 'SevenAssoc'
  // 어금니 사무소
  | 'MolarOffice'
  // 피쿼드호
  | 'ThePequod'
  // 디에치 협회
  | 'DieciAssoc'
  // E.G.O 장비
  | 'EGOGear'
  // 조직
  | 'Syndicate'
  // 검계
  | 'BladeLineage'
  // 기술해방연합
  | 'TechnologyLiberationAlliance'
  // W사
  | 'WCorp'
  // 약지
  | 'TheRing'
  // 로보토미 본사
  | 'LobotomyHeadquarters'
  // 리우 협회
  | 'LiuAssoc'
  // N사
  | 'NCorp'
  // H사
  | 'HCorp'
  // 흑수
  | 'HeishouPack'
  // 흑수-오
  | 'HeishouPackWuBranch'
  // 흑수-필두
  | 'HeishouPackAdept'
  // 가씨 가문
  | 'JiaFamily'
  // 로보토미 지부
  | 'LobotomyCorpBranch'
  // 츠바이 협회
  | 'ZweiAssoc'
  // 워더링 하이츠
  | 'WutheringHeights'
  // N사 광신도
  | 'NCorpFanatic'
  // 기계 융화 생명체
  | 'MechanicalAmalgam'
  // 멀티크랙 사무소
  | 'MulticrackOffice'
  // 흑수-묘
  | 'HeishouPackMaoBranch'
  // 시 협회
  | 'ShiAssoc'
  // 섕크 협회
  | 'CinqAssoc'
  // 중지
  | 'TheMiddle'
  // T사
  | 'TCorp'
  // 라만차랜드
  | 'LaManchaland'
  // 혈귀
  | 'Bllodfiend'
  // 제2권속
  | 'SecondKindred'
  // 유로지비
  | 'Yurodivy'
  // 흑운회
  | 'KurokumoClan'
  // 뒷골목
  | 'TheBackstreets'
  // 료.고.파
  | 'RB'
  // 에드가 가문
  | 'EdgarFamily'
  // 장미스패너 공방
  | 'RosespannerWorkshop'
  // 데드레밋츠
  | 'DeadRabbits'
  // R사
  | 'RCorp'
  // 엄지
  | 'TheThumb'
  // 카포
  | 'Capo'
  // 제3권속
  | 'ThirdKindred'
  // 갈고리 사무소
  | 'HookOffice'
  // 송곳니 사냥 사무소
  | 'FanghuntOffice'
  // 콩콩이파
  | 'TingTangGang'
  // K사
  | 'KCorp'
  // 마침표 사무소
  | 'FullStopOffice'
  // 외우피 협회
  | 'OufiAssoc'
  // 와일드헌트
  | 'WildHunt'
  // 가주 후보
  | 'FamilyHierarchCandidate'
  // 협력 사무소-외우피
  | 'AssociateOfficeOufi'
  // 정사무소
  | 'JeongsOffice'
  // 제뱌찌 협회
  | 'DevyatAssoc'
  // 흑수-사
  | 'HeishouPackSiBranch'
  // 마리아치
  | 'LosMariachis'
  // 솔다토
  | 'Soldato'
  // 흑수-유
  | 'HeishouPackYouBranch'
  // G사
  | 'GCorp'
  // 쌍갈고리 새적단
  | 'TwinhookPirates'
  // 밤의 송곳
  | 'NightAwls';
