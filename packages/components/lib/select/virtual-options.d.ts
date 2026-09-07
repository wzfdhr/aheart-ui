export interface ResolvedSelectVirtual {
    height: number;
    estimateSize: number;
    overscan: number;
}
/** Resolves Select's opt-in virtual list settings without mutating user input. */
export declare const normalizeSelectVirtual: (value: unknown, warn?: ((message: string) => void) | undefined) => ResolvedSelectVirtual | null;
