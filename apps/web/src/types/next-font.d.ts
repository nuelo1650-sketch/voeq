declare module 'next/font/google' {
  import type { CssVariable, NextFont, NextFontWithVariable, Display } from 'next/dist/compiled/@next/font/dist/types';

  export declare function Geist<T extends CssVariable | undefined = undefined>(options?: {
    weight?: '400' | '500' | '600' | '700' | 'variable' | Array<'400' | '500' | '600' | '700'>;
    style?: 'normal' | Array<'normal'>;
    display?: Display;
    variable?: T;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
    subsets?: Array<'latin' | 'latin-ext'>;
  }): T extends undefined ? NextFont : NextFontWithVariable;

  export declare function Geist_Mono<T extends CssVariable | undefined = undefined>(options?: {
    weight?: '400' | '500' | 'variable' | Array<'400' | '500'>;
    style?: 'normal' | Array<'normal'>;
    display?: Display;
    variable?: T;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
    subsets?: Array<'latin' | 'latin-ext'>;
  }): T extends undefined ? NextFont : NextFontWithVariable;

  export declare function Fraunces<T extends CssVariable | undefined = undefined>(options?: {
    weight?: '400' | '500' | '600' | '700' | 'variable' | Array<'400' | '500' | '600' | '700'>;
    style?: 'normal' | 'italic' | Array<'normal' | 'italic'>;
    display?: Display;
    variable?: T;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
    subsets?: Array<'latin' | 'latin-ext'>;
    axes?: string[];
  }): T extends undefined ? NextFont : NextFontWithVariable;
}
