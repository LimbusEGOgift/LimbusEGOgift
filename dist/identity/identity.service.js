"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
let IdentityService = class IdentityService {
    async findIdentityList() {
        const result = {};
        const entries = await (0, promises_1.readdir)("identity", { withFileTypes: true });
        await Promise.all(entries.map(async (ent) => {
            const p = (0, node_path_1.join)("identity", ent.name);
            const Sinner = await (0, promises_1.readFile)(p, "utf-8");
            const parsed = JSON.parse(Sinner);
            const Identitys = Object.keys(parsed);
            result[(0, node_path_1.basename)(ent.name, ".json")] = Identitys;
        }));
        return result;
    }
    async findEGOGiftForIdentity(dto) {
        const Sinner = await (0, promises_1.readFile)(`identity/${dto.sinner}.json`, "utf-8");
        const keyWord = JSON.parse(Sinner)[dto.identity]["키워드"];
        return keyWord;
    }
};
exports.IdentityService = IdentityService;
exports.IdentityService = IdentityService = __decorate([
    (0, common_1.Injectable)()
], IdentityService);
//# sourceMappingURL=identity.service.js.map