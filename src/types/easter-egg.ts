export type EasterEggId =
    | "konami"
    | "type-mohiwalla"
    | "ten-clicks"
    | "cmdk"
    | "chess"
    | "terminal"
    | "bsod";

export interface EasterEgg {
    id: EasterEggId;
    label: string;
    hint: string;
}
