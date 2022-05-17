import * as ProjectConfig from 'models/utils/project-config';

export default function generateIcon(iconName, isSymbol = false) {
    if (isSymbol) {
        return `<svg><use xlink:href="${ProjectConfig.get(
            'assetsUrl'
        )}icons/svgsprites.svg#${iconName}" /></svg>`;
    }
}
