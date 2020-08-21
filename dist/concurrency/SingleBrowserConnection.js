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
const ConcurrencyImplementation_1 = require("./ConcurrencyImplementation");
const util_1 = require("../util");
const debug = util_1.debugGenerator("SingleBrowserConn");
const BROWSER_TIMEOUT = 5000;
class SingleBrowserConnection extends ConcurrencyImplementation_1.default {
    constructor(options, puppeteer) {
        super(options, puppeteer);
        this.browser = null;
        this.repairing = false;
        this.repairRequested = false;
        this.openInstances = 0;
        this.waitingForRepairResolvers = [];
        debug(`Received Connect Options ${JSON.stringify(options)}`);
    }
    repair() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.openInstances !== 0 || this.repairing) {
                // already repairing or there are still pages open? wait for start/finish
                yield new Promise((resolve) => this.waitingForRepairResolvers.push(resolve));
                return;
            }
            this.repairing = true;
            debug("Starting repair");
            try {
                // will probably fail, but just in case the repair was not necessary
                yield this.browser.close();
            }
            catch (e) {
                debug("Unable to close browser.");
            }
            try {
                this.browser = (yield this.puppeteer.connect(this.options));
            }
            catch (err) {
                throw new Error("Unable to restart chrome.");
            }
            this.repairRequested = false;
            this.repairing = false;
            this.waitingForRepairResolvers.forEach((resolve) => resolve());
            this.waitingForRepairResolvers = [];
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield this.puppeteer.connect(this.options);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
        });
    }
    workerInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            let resources;
            return {
                jobInstance: () => __awaiter(this, void 0, void 0, function* () {
                    if (this.repairRequested) {
                        yield this.repair();
                    }
                    yield util_1.timeoutExecute(BROWSER_TIMEOUT, (() => __awaiter(this, void 0, void 0, function* () {
                        resources = yield this.createResources();
                    }))());
                    this.openInstances += 1;
                    return {
                        resources,
                        close: () => __awaiter(this, void 0, void 0, function* () {
                            this.openInstances -= 1; // decrement first in case of error
                            yield util_1.timeoutExecute(BROWSER_TIMEOUT, this.freeResources(resources));
                            if (this.repairRequested) {
                                yield this.repair();
                            }
                        }),
                    };
                }),
                close: () => __awaiter(this, void 0, void 0, function* () { }),
                repair: () => __awaiter(this, void 0, void 0, function* () {
                    debug("Repair requested");
                    this.repairRequested = true;
                    yield this.repair();
                }),
            };
        });
    }
}
exports.default = SingleBrowserConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2luZ2xlQnJvd3NlckNvbm5lY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uY3VycmVuY3kvU2luZ2xlQnJvd3NlckNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSwyRUFFcUM7QUFFckMsa0NBQXlEO0FBQ3pELE1BQU0sS0FBSyxHQUFHLHFCQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUVsRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFFN0IsTUFBOEIsdUJBQXdCLFNBQVEsbUNBQXlCO0lBUW5GLFlBQW1CLE9BQWlDLEVBQUUsU0FBYztRQUNoRSxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBUnBCLFlBQU8sR0FBNkIsSUFBSSxDQUFDO1FBRTNDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0Isb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsOEJBQXlCLEdBQW1CLEVBQUUsQ0FBQztRQUluRCxLQUFLLENBQUMsNEJBQTRCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFYSxNQUFNOztZQUNoQixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQzVDLHlFQUF5RTtnQkFDekUsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQzFCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQy9DLENBQUM7Z0JBQ0YsT0FBTzthQUNWO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFekIsSUFBSTtnQkFDQSxvRUFBb0U7Z0JBQ3BFLE1BQTBCLElBQUks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