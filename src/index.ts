import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FittedImage } from './fitted-image/fitted-image';
import { ZoomableImage } from './zoomable-image/zoomable-image';
import { GalleryModal } from './gallery-modal/gallery-modal';

import { TouchEventsDirective } from './directives/touch-events';

import { GalleryModalHammerConfig } from './overrides/gallery-modal-hammer-config';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
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
    CommonModule
  ],
  entryComponents: [
    GalleryModal,
  ]
})
export class GalleryModalModule {}
export { FittedImage, ZoomableImage, GalleryModal, GalleryModalHammerConfig, TouchEventsDirective }
