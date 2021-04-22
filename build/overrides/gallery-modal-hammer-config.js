import { HammerGestureConfig } from '@angular/platform-browser';
export class GalleryModalHammerConfig extends HammerGestureConfig {
    constructor() {
        super(...arguments);
        this.overrides = {
            pan: {
                direction: 30,
            },
            press: {
                time: 300,
            },
        };
    }
}
function GalleryModalHammerConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    GalleryModalHammerConfig.prototype.overrides;
}
