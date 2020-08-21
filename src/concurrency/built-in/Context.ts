import * as puppeteer from "puppeteer";

import { ResourceData } from "../ConcurrencyImplementation";
import SingleBrowserConnection from "../SingleBrowserConnection";

export default class Context extends SingleBrowserConnection {
    protected async createResources(): Promise<ResourceData> {
        const context = await (this
            .browser as puppeteer.Browser).createIncognitoBrowserContext();
        const page = await context.newPage();
        return {
            context,
            page,
        };
    }

    protected async freeResources(resources: ResourceData): Promise<void> {
        await resources.context.close();
    }
}
