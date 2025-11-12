import { IdentityService } from "./identity.service";
import { FindEGOGiftDto } from "./dto/findEGOGift.dto";
export declare class IdentityController {
    private readonly app;
    constructor(app: IdentityService);
    findIdentity(): Promise<{
        [x: string]: string[];
    }>;
    findEGOGift(dto: FindEGOGiftDto): Promise<{
        [x: string]: string[];
    }>;
}
