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
const debug = util_1.debugGenerator("SingleBrowserImpl");
const BROWSER_TIMEOUT = 5000;
class SingleBrowserConnection extends ConcurrencyImplementation_1.default {
    constructor(options, puppeteer) {
        super(options, puppeteer);
        this.browser = null;
        this.repairing = false;
        this.repairRequested = false;
        this.openInstances = 0;
        this.waitingForRepairResolvers = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2luZ2xlQnJvd3NlckNvbm5lY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uY3VycmVuY3kvU2luZ2xlQnJvd3NlckNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSwyRUFFcUM7QUFFckMsa0NBQXlEO0FBQ3pELE1BQU0sS0FBSyxHQUFHLHFCQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUVsRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFFN0IsTUFBOEIsdUJBQXdCLFNBQVEsbUNBQXlCO0lBUW5GLFlBQW1CLE9BQWlDLEVBQUUsU0FBYztRQUNoRSxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBUnBCLFlBQU8sR0FBNkIsSUFBSSxDQUFDO1FBRTNDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0Isb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsOEJBQXlCLEdBQW1CLEVBQUUsQ0FBQztJQUl2RCxDQUFDO0lBRWEsTUFBTTs7WUFDaEIsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUM1Qyx5RUFBeUU7Z0JBQ3pFLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUMxQixJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUMvQyxDQUFDO2dCQUNGLE9BQU87YUFDVjtZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRXpCLElBQUk7Z0JBQ0Esb0VBQW9FO2dCQUNwRSxNQUEwQixJQUFJLENBQUMsT0FBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ25EO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7YUFDckM7WUFFRCxJQUFJO2dCQUNBLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUN4QyxJQUFJLENBQUMsT0FBTyxDQUNmLENBQXNCLENBQUM7YUFDM0I7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7YUFDaEQ7WUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyx5QkFBeUIsR0FBRyxFQUFFLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBRVksSUFBSTs7WUFDYixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlELENBQUM7S0FBQTtJQUVZLEtBQUs7O1lBQ2QsTUFBTyxJQUFJLENBQUMsT0FBNkIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0RCxDQUFDO0tBQUE7SUFRWSxjQUFjOztZQUN2QixJQUFJLFNBQXVCLENBQUM7WUFFNUIsT0FBTztnQkFDSCxXQUFXLEVBQUUsR0FBUyxFQUFFO29CQUNwQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7d0JBQ3RCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUN2QjtvQkFFRCxNQUFNLHFCQUFjLENBQ2hCLGVBQWUsRUFDZixDQUFDLEdBQVMsRUFBRTt3QkFDUixTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQzdDLENBQUMsQ0FBQSxDQUFDLEVBQUUsQ0FDUCxDQUFDO29CQUNGLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDO29CQUV4QixPQUFPO3dCQUNILFNBQVM7d0JBRVQsS0FBSyxFQUFFLEdBQVMsRUFBRTs0QkFDZCxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1DQUFtQzs0QkFDNUQsTUFBTSxxQkFBYyxDQUNoQixlQUFlLEVBQ2YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FDaEMsQ0FBQzs0QkFFRixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0NBQ3RCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOzZCQUN2Qjt3QkFDTCxDQUFDLENBQUE7cUJBQ0osQ0FBQztnQkFDTixDQUFDLENBQUE7Z0JBRUQsS0FBSyxFQUFFLEdBQVMsRUFBRSxnREFBRSxDQUFDLENBQUE7Z0JBRXJCLE1BQU0sRUFBRSxHQUFTLEVBQUU7b0JBQ2YsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO29CQUM1QixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDeEIsQ0FBQyxDQUFBO2FBQ0osQ0FBQztRQUNOLENBQUM7S0FBQTtDQUNKO0FBckdELDBDQXFHQyJ9