import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export interface RegistryIcon {
    name: string;
    src: string;
}

export function registerIcons(
    registry: MatIconRegistry,
    sanitizer: DomSanitizer,
    namespace: string,
    icons: RegistryIcon[]
) {
    icons.forEach((icon) => registry.addSvgIconInNamespace(namespace, icon.name, sanitizer.bypassSecurityTrustResourceUrl(icon.src)));
}
