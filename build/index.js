import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FittedImage } from './fitted-image/fitted-image';
import { ZoomableImage } from './zoomable-image/zoomable-image';
import { GalleryModal } from './gallery-modal/gallery-modal';
import { TouchEventsDirective } from './directives/touch-events';
import { GalleryModalHammerConfig } from './overrides/gallery-modal-hammer-config';
export class GalleryModalModule {
}
GalleryModalModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    TouchEventsDirective,
                    FittedImage,
                    ZoomableImage,
                    GalleryModal,
                ],
                declarations: [
                    FittedImage,
                    ZoomableImage,
                    GalleryModal,
                    TouchEventsDirective,
                ],
                exports: [
                    FittedImage,
                    ZoomableImage,
                    GalleryModal,
                    TouchEventsDirective,
                ],
                entryComponents: [
                    GalleryModal,
                ],
            },] },
];
/**
 * @nocollapse
 */
GalleryModalModule.ctorParameters = () => [];
function GalleryModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    GalleryModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    GalleryModalModule.ctorParameters;
}
export { FittedImage, ZoomableImage, GalleryModal, GalleryModalHammerConfig, TouchEventsDirective };
