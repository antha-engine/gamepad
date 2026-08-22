import {PredefinedGamepadBrand} from '@antha/gamepad-type';
import {check} from '@augment-vir/assert';

const fallbackBrandColor = '#ffaaaa';

const gamepadBrandColors: Readonly<Record<PredefinedGamepadBrand, string>> = {
    [PredefinedGamepadBrand.Microsoft]: '#aaff97',
    [PredefinedGamepadBrand.Nintendo]: '#ffaaaa',
    [PredefinedGamepadBrand.Sony]: '#86e2ff',
    [PredefinedGamepadBrand.Valve]: '#f74843',
};

export function getGamepadBrandColor(gamepadBrand: string | undefined): string {
    return check.isEnumValue(gamepadBrand, PredefinedGamepadBrand)
        ? gamepadBrandColors[gamepadBrand]
        : fallbackBrandColor;
}
