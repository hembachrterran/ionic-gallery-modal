var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Subject } from 'rxjs/index';
;
export class GalleryModal {
    /**
     * @param {?} viewCtrl
     * @param {?} params
     * @param {?} element
     * @param {?} platform
     * @param {?} domSanitizer
     */
    constructor(viewCtrl, params, element, platform, domSanitizer) {
        this.viewCtrl = viewCtrl;
        this.element = element;
        this.platform = platform;
        this.domSanitizer = domSanitizer;
        this.sliderDisabled = false;
        this.initialSlide = 0;
        this.currentSlide = 0;
        this.sliderLoaded = false;
        this.closeIcon = 'arrow-back';
        this.resizeTriggerer = new Subject();
        this.slidesDragging = false;
        this.panUpDownRatio = 0;
        this.panUpDownDeltaY = 0;
        this.dismissed = false;
        this.width = 0;
        this.height = 0;
        this.slidesStyle = {
            visibility: 'hidden',
        };
        this.modalStyle = {
            backgroundColor: 'rgba(0, 0, 0, 1)',
        };
        this.transitionDuration = '200ms';
        this.transitionTimingFunction = 'cubic-bezier(0.33, 0.66, 0.66, 1)';
        this.photos = params.get('photos') || [];
        this.closeIcon = params.get('closeIcon') || 'arrow-back';
        this.initialSlide = params.get('initialSlide') || 0;
        this.initialImage = this.photos[this.initialSlide] || {};
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // call resize on init
        this.resize({});
    }
    /**
     * Closes the modal (when user click on CLOSE)
     * @return {?}
     */
    dismiss() {
        return __awaiter(this, void 0, void 0, function* () {
            const /** @type {?} */ modal = yield this.viewCtrl.getTop();
            modal.dismiss();
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    resize(event) {
        if (this.slider)
            this.slider.update();
        this.width = this.element.nativeElement.offsetWidth;
        this.height = this.element.nativeElement.offsetHeight;
        this.resizeTriggerer.next({
            width: this.width,
            height: this.height,
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    orientationChange(event) {
        // TODO: See if you can remove timeout
        window.setTimeout(() => {
            this.resize(event);
        }, 150);
    }
    /**
     * When the modal has entered into view
     * @return {?}
     */
    ionViewDidEnter() {
        this.resize(false);
        this.sliderLoaded = true;
        this.slidesStyle.visibility = 'visible';
    }
    /**
     * Disables the scroll through the slider
     *
     * @param {?} event
     * @return {?}
     */
    disableScroll(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sliderDisabled) {
                this.currentSlide = yield this.slider.getActiveIndex();
                this.sliderDisabled = true;
            }
        });
    }
    /**
     * Enables the scroll through the slider
     *
     * @param {?} event
     * @return {?}
     */
    enableScroll(event) {
        if (this.sliderDisabled) {
            this.slider.slideTo(this.currentSlide, 0, false);
            this.sliderDisabled = false;
        }
    }
    /**
     * Called while dragging to close modal
     *
     * @param {?} event
     * @return {?}
     */
    slidesDrag(event) {
        this.slidesDragging = true;
    }
    /**
     * Called when the user pans up/down
     *
     * @param {?} event
     * @return {?}
     */
    panUpDownEvent(event) {
        event.preventDefault();
        if (this.slidesDragging || this.sliderDisabled) {
            return;
        }
        let /** @type {?} */ ratio = (event.distance / (this.height / 2));
        if (ratio > 1) {
            ratio = 1;
        }
        else if (ratio < 0) {
            ratio = 0;
        }
        const /** @type {?} */ scale = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.2));
        const /** @type {?} */ opacity = (event.deltaY < 0 ? 1 - (ratio * 0.5) : 1 - (ratio * 0.2));
        const /** @type {?} */ backgroundOpacity = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.8));
        this.panUpDownRatio = ratio;
        this.panUpDownDeltaY = event.deltaY;
        this.slidesStyle.transform = `translate(0, ${event.deltaY}px) scale(${scale})`;
        this.slidesStyle.opacity = opacity;
        this.modalStyle.backgroundColor = `rgba(0, 0, 0, ${backgroundOpacity})`;
        delete this.slidesStyle.transitionProperty;
        delete this.slidesStyle.transitionDuration;
        delete this.slidesStyle.transitionTimingFunction;
        delete this.modalStyle.transitionProperty;
        delete this.modalStyle.transitionDuration;
        delete this.modalStyle.transitionTimingFunction;
    }
    /**
     * Called when the user stopped panning up/down
     *
     * @param {?} event
     * @return {?}
     */
    panEndEvent(event) {
        this.slidesDragging = false;
        this.panUpDownRatio += event.velocityY * 30;
        if (this.panUpDownRatio >= 0.65 && this.panUpDownDeltaY > 0) {
            if (!this.dismissed) {
                this.dismiss();
            }
            this.dismissed = true;
        }
        else {
            this.slidesStyle.transitionProperty = 'transform';
            this.slidesStyle.transitionTimingFunction = this.transitionTimingFunction;
            this.slidesStyle.transitionDuration = this.transitionDuration;
            this.modalStyle.transitionProperty = 'background-color';
            this.modalStyle.transitionTimingFunction = this.transitionTimingFunction;
            this.modalStyle.transitionDuration = this.transitionDuration;
            this.slidesStyle.transform = 'none';
            this.slidesStyle.opacity = 1;
            this.modalStyle.backgroundColor = 'rgba(0, 0, 0, 1)';
        }
    }
}
GalleryModal.decorators = [
    { type: Component, args: [{
                selector: 'gallery-modal',
                template: "<ion-content class=\"gallery-modal\" no-bounce [ngStyle]=\"modalStyle\" (window:resize)=\"resize($event)\" (window:orientationchange)=\"orientationChange($event)\" > <button class=\"close-button\" ion-button icon-only (click)=\"dismiss()\"> <ion-icon name=\"{{ closeIcon }}\"></ion-icon> </button> <!-- Initial image while modal is animating --> <div class=\"image-on-top\" [hidden]=\"sliderLoaded\"> <zoomable-image [photo]=\"initialImage\" [resizeTriggerer]=\"resizeTriggerer\" [wrapperWidth]=\"width\" [wrapperHeight]=\"height\" ></zoomable-image> </div> <!-- Slider with images --> <ion-slides class=\"slider\" #slider *ngIf=\"photos.length\" [initialSlide]=\"initialSlide\" [ngStyle]=\"slidesStyle\" touch-events (ionSlideDrag)=\"slidesDrag($event)\" (panup)=\"panUpDownEvent($event)\" (pandown)=\"panUpDownEvent($event)\" (panend)=\"panEndEvent($event)\" (pancancel)=\"panEndEvent($event)\" > <ion-slide *ngFor=\"let photo of photos;\"> <zoomable-image [photo]=\"photo\" [resizeTriggerer]=\"resizeTriggerer\" [wrapperWidth]=\"width\" [wrapperHeight]=\"height\" [ngClass]=\"{ 'swiper-no-swiping': sliderDisabled }\" (disableScroll)=\"disableScroll($event)\" (enableScroll)=\"enableScroll($event)\" ></zoomable-image> </ion-slide> </ion-slides> </ion-content> ",
                styles: [":host .gallery-modal { position: relative; overflow: hidden; } :host .gallery-modal .close-button { position: absolute; top: 10px; left: 5px; background: none; box-shadow: none; z-index: 10; } :host .gallery-modal .close-button.button-ios { top: 20px; } :host .gallery-modal .slider /deep/ .slide-zoom { position: relative; height: 100%; } :host .gallery-modal .image-on-top { display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; } :host .gallery-modal .image-on-top fitted-image { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } "],
            },] },
];
/**
 * @nocollapse
 */
GalleryModal.ctorParameters = () => [
    { type: ModalController, },
    { type: NavParams, },
    { type: ElementRef, },
    { type: Platform, },
    { type: DomSanitizer, },
];
GalleryModal.propDecorators = {
    'slider': [{ type: ViewChild, args: ['slider',] },],
};
function GalleryModal_tsickle_Closure_declarations() {
    /** @type {?} */
    GalleryModal.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    GalleryModal.ctorParameters;
    /** @type {?} */
    GalleryModal.propDecorators;
    /** @type {?} */
    GalleryModal.prototype.slider;
    /** @type {?} */
    GalleryModal.prototype.initialImage;
    /** @type {?} */
    GalleryModal.prototype.photos;
    /** @type {?} */
    GalleryModal.prototype.sliderDisabled;
    /** @type {?} */
    GalleryModal.prototype.initialSlide;
    /** @type {?} */
    GalleryModal.prototype.currentSlide;
    /** @type {?} */
    GalleryModal.prototype.sliderLoaded;
    /** @type {?} */
    GalleryModal.prototype.closeIcon;
    /** @type {?} */
    GalleryModal.prototype.resizeTriggerer;
    /** @type {?} */
    GalleryModal.prototype.slidesDragging;
    /** @type {?} */
    GalleryModal.prototype.panUpDownRatio;
    /** @type {?} */
    GalleryModal.prototype.panUpDownDeltaY;
    /** @type {?} */
    GalleryModal.prototype.dismissed;
    /** @type {?} */
    GalleryModal.prototype.width;
    /** @type {?} */
    GalleryModal.prototype.height;
    /** @type {?} */
    GalleryModal.prototype.slidesStyle;
    /** @type {?} */
    GalleryModal.prototype.modalStyle;
    /** @type {?} */
    GalleryModal.prototype.transitionDuration;
    /** @type {?} */
    GalleryModal.prototype.transitionTimingFunction;
    /** @type {?} */
    GalleryModal.prototype.viewCtrl;
    /** @type {?} */
    GalleryModal.prototype.element;
    /** @type {?} */
    GalleryModal.prototype.platform;
    /** @type {?} */
    GalleryModal.prototype.domSanitizer;
}
