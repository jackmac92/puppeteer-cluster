import { ResourceData } from "../ConcurrencyImplementation";
import SingleBrowserConnection from "../SingleBrowserConnection";
export default class Context extends SingleBrowserConnection {
    protected createResources(): Promise<ResourceData>;
    protected freeResources(resources: ResourceData): Promise<void>;
}
