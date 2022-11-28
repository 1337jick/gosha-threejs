import { breakpoints } from 'models/breakpoints';

export function changeWordsSymbolsToPassedSymbol(text, symbol) {
    const splitSymbol = breakpoints.isNotebook ? ' ' : /<br>/;
    const joinSymbol = breakpoints.isNotebook ? ' ' : '<br>';
    const words = text.split(splitSymbol);
    return words
        .map((word) => word.split('').fill(symbol).join(''))
        .join(joinSymbol);
}