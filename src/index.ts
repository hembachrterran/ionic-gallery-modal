import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FittedImage } from './fitted-image/fitted-image';
import { ZoomableImage } from './zoomable-image/zoomable-image';
import { GalleryModal } from './gallery-modal/gallery-modal';

import { TouchEventsDirective } from './directives/touch-events';

import { GalleryModalHammerConfig } from './overrides/gallery-modal-hammer-config';


@NgModule({
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
})
export class GalleryModalModule {}
export { FittedImage, ZoomableImage, GalleryModal, GalleryModalHammerConfig, TouchEventsDirective }
