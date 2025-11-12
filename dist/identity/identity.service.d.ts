import { FindEGOGiftDto } from "./dto/findEGOGift.dto";
type KeyMap = Record<string, string[]>;
export declare class IdentityService {
    findIdentityList(): Promise<KeyMap>;
    findEGOGiftForIdentity(dto: FindEGOGiftDto): Promise<KeyMap>;
}
export {};
