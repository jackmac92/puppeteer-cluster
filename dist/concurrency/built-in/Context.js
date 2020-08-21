"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SingleBrowserConnection_1 = require("../SingleBrowserConnection");
class Context extends SingleBrowserConnection_1.default {
    createResources() {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this
                .browser.createIncognitoBrowserContext();
            const page = yield context.newPage();
            return {
                context,
                page,
            };
        });
    }
    freeResources(resources) {
        return __awaiter(this, void 0, void 0, function* () {
            yield resources.context.close();
        });
    }
}
exports.default = Context;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25jdXJyZW5jeS9idWlsdC1pbi9Db250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0Esd0VBQWlFO0FBRWpFLE1BQXFCLE9BQVEsU0FBUSxpQ0FBdUI7SUFDeEMsZUFBZTs7WUFDM0IsTUFBTSxPQUFPLEdBQUcsTUFBTyxJQUFJO2lCQUN0QixPQUE2QixDQUFDLDZCQUE2QixFQUFFLENBQUM7WUFDbkUsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckMsT0FBTztnQkFDSCxPQUFPO2dCQUNQLElBQUk7YUFDUCxDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRWUsYUFBYSxDQUFDLFNBQXVCOztZQUNqRCxNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUFBO0NBQ0o7QUFkRCwwQkFjQyJ9