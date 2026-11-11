import { type AheartDomain } from '../constant';
export interface AheartUIResolverOptions {
    domains?: readonly AheartDomain[];
    importStyle?: 'css' | false;
}
export interface AheartResolvedComponent {
    name: string;
    from: string;
    sideEffects?: string[];
}
export declare function AheartUIResolver({ domains, importStyle }?: AheartUIResolverOptions): (componentName: string) => AheartResolvedComponent | undefined;
