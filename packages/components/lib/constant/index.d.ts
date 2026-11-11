export type AheartDomain = 'base' | 'ai' | 'dnd';
export interface AheartComponentEntry {
    readonly domain: AheartDomain;
    readonly name: string;
    readonly from: string;
    readonly styles: readonly string[];
}
/** Static public entries used by the resolver, without loading any Vue components. */
export declare const aheartComponentEntries: readonly AheartComponentEntry[];
