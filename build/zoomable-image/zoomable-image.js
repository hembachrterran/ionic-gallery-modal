import { Component, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
;
export class ZoomableImage {
    constructor() {
        this.disableScroll = new EventEmitter();
        this.enableScroll = new EventEmitter();
        this.zoomChange = new EventEmitter();
        this.scale = 1;
        this.scaleStart = 1;
        this.maxScale = 3;
        this.minScale = 1;
        this.minScaleBounce = 0.2;
        this.maxScaleBounce = 0.35;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.originalSize = {
            width: 0,
            height: 0,
        };
        this.position = {
            x: 0,
            y: 0,
        };
        this.scroll = {
            x: 0,
            y: 0,
        };
        this.centerRatio = {
            x: 0,
            y: 0,
        };
        this.centerStart = {
            x: 0,
            y: 0,
        };
        this.panCenterStart = {
            x: 0, y: 0,
        };
        this.containerStyle = {};
        this.imageStyle = {};
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Get the scrollable element
        this.scrollableElement = this.ionScrollContainer.nativeElement.querySelector('.scroll-content');
        // Attach events
        this.attachEvents();
        // Listen to parent resize
        this.resizeSubscription = this.resizeTriggerer.subscribe(event => {
            this.resize(event);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.scrollableElement.removeEventListener('scroll', this.scrollListener);
        this.resizeSubscription.unsubscribe();
    }
    /**
     * Attach the events to the items
     * @return {?}
     */
    attachEvents() {
        // Scroll event
        this.scrollListener = this.scrollEvent.bind(this);
        this.scrollableElement.addEventListener('scroll', this.scrollListener);
    }
    /**
     * Called every time the window gets resized
     * @param {?} event
     * @return {?}
     */
    resize(event) {
        // Get the image dimensions
        this.saveImageDimensions();
    }
    /**
     * Called when the image has dimensions
     *
     * @param {?} dimensions
     * @return {?}
     */
    handleImageResized(dimensions) {
        this.imageWidth = dimensions.width;
        this.imageHeight = dimensions.height;
        this.originalSize.width = dimensions.originalWidth;
        this.originalSize.height = dimensions.originalHeight;
        this.saveImageDimensions();
    }
    /**
     * Save the image dimensions (when it has the image)
     * @return {?}
     */
    saveImageDimensions() {
        const /** @type {?} */ width = this.originalSize.width;
        const /** @type {?} */ height = this.originalSize.height;
        this.maxScale = Math.max(width / this.imageWidth - this.maxScaleBounce, 1);
        this.displayScale();
    }
    /**
     * While the user is pinching
     *
     * @param {?} event
     * @return {?}
     */
    pinchEvent(event) {
        let /** @type {?} */ scale = this.scaleStart * event.scale;
        if (scale > this.maxScale) {
            scale = this.maxScale + (1 - this.maxScale / scale) * this.maxScaleBounce;
        }
        else if (scale < this.minScale) {
            scale = this.minScale - (1 - scale / this.minScale) * this.minScaleBounce;
        }
        this.scale = scale;
        this.displayScale();
        this.zoomChange.emit({
            scale: this.scale,
        });
        event.preventDefault();
    }
    /**
     * When the user starts pinching
     *
     * @param {?} event
     * @return {?}
     */
    pinchStartEvent(event) {
        this.scaleStart = this.scale;
        this.setCenter(event);
    }
    /**
     * When the user stops pinching
     *
     * @param {?} event
     * @return {?}
     */
    pinchEndEvent(event) {
        this.checkScroll();
        if (this.scale > this.maxScale) {
            this.animateScale(this.maxScale);
            this.zoomChange.emit({
                scale: this.maxScale,
            });
        }
        else if (this.scale < this.minScale) {
            this.animateScale(this.minScale);
            this.zoomChange.emit({
                scale: this.minScale,
            });
        }
        else {
            this.zoomChange.emit({
                scale: this.scale,
            });
        }
    }
    /**
     * When the user double taps on the photo
     *
     * @param {?} event
     * @return {?}
     */
    doubleTapEvent(event) {
        this.setCenter(event);
        let /** @type {?} */ scale = this.scale > 1 ? 1 : 2.5;
        if (scale > this.maxScale) {
            scale = this.maxScale;
        }
        this.zoomChange.emit({
            scale: scale,
        });
        this.animateScale(scale);
    }
    /**
     * Called when the user is panning
     *
     * @param {?} event
     * @return {?}
     */
    panEvent(event) {
        // calculate center x,y since pan started
        const /** @type {?} */ x = Math.max(Math.floor(this.panCenterStart.x + event.deltaX), 0);
        const /** @type {?} */ y = Math.max(Math.floor(this.panCenterStart.y + event.deltaY), 0);
        this.centerStart.x = x;
        this.centerStart.y = y;
        if (event.isFinal) {
            this.panCenterStart.x = x;
            this.panCenterStart.y = y;
        }
        this.displayScale();
    }
    /**
     * When the user is scrolling
     *
     * @param {?} event
     * @return {?}
     */
    scrollEvent(event) {
        this.scroll.x = event.target.scrollLeft;
        this.scroll.y = event.target.scrollTop;
    }
    /**
     * Set the startup center calculated on the image (along with the ratio)
     *
     * @param {?} event
     * @return {?}
     */
    setCenter(event) {
        const /** @type {?} */ realImageWidth = this.imageWidth * this.scale;
        const /** @type {?} */ realImageHeight = this.imageHeight * this.scale;
        this.centerStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
        this.centerStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
        this.panCenterStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
        this.panCenterStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
        this.centerRatio.x = Math.min((this.centerStart.x + this.scroll.x) / realImageWidth, 1);
        this.centerRatio.y = Math.min((this.centerStart.y + this.scroll.y) / realImageHeight, 1);
    }
    /**
     * Calculate the position and set the proper scale to the element and the
     * container
     * @return {?}
     */
    displayScale() {
        const /** @type {?} */ realImageWidth = this.imageWidth * this.scale;
        const /** @type {?} */ realImageHeight = this.imageHeight * this.scale;
        this.position.x = Math.max((this.wrapperWidth - realImageWidth) / (2 * this.scale), 0);
        this.position.y = Math.max((this.wrapperHeight - realImageHeight) / (2 * this.scale), 0);
        this.imageStyle.transform = `scale(${this.scale}) translate(${this.position.x}px, ${this.position.y}px)`;
        this.containerStyle.width = `${realImageWidth}px`;
        this.containerStyle.height = `${realImageHeight}px`;
        this.scroll.x = this.centerRatio.x * realImageWidth - this.centerStart.x;
        this.scroll.y = this.centerRatio.y * realImageWidth - this.centerStart.y;
        // Set scroll of the ion scroll
        this.scrollableElement.scrollLeft = this.scroll.x;
        this.scrollableElement.scrollTop = this.scroll.y;
    }
    /**
     * Check wether to disable or enable scroll and then call the events
     * @return {?}
     */
    checkScroll() {
        if (this.scale > 1) {
            this.disableScroll.emit({});
        }
        else {
            this.enableScroll.emit({});
        }
    }
    /**
     * Animates to a certain scale (with ease)
     *
     * @param {?} scale
     * @return {?}
     */
    animateScale(scale) {
        this.scale += (scale - this.scale) / 5;
        if (Math.abs(this.scale - scale) <= 0.1) {
            this.scale = scale;
        }
        this.displayScale();
        if (Math.abs(this.scale - scale) > 0.1) {
            window.requestAnimationFrame(this.animateScale.bind(this, scale));
        }
        else {
            this.checkScroll();
        }
    }
}
ZoomableImage.decorators = [
    { type: Component, args: [{
                selector: 'zoomable-image',
                template: "<ion-scroll #ionScrollContainer scrollX=\"true\" scrollY=\"true\" zoom=\"false\"> <div class=\"image\" touch-events direction=\"y\" (pinch)=\"pinchEvent($event)\" (pinchstart)=\"pinchStartEvent($event)\" (pinchend)=\"pinchEndEvent($event)\" (doubletap)=\"doubleTapEvent($event)\" (onpan)=\"panEvent($event)\" [ngStyle]=\"containerStyle\" > <fitted-image [photo]=\"photo\" [ngStyle]=\"imageStyle\" [resizeTriggerer]=\"resizeTriggerer\" [wrapperWidth]=\"wrapperWidth\" [wrapperHeight]=\"wrapperHeight\" (onImageResized)=\"handleImageResized($event)\" ></fitted-image> </div> </ion-scroll> <div class=\"fitted-image-title\" *ngIf=\"photo.title\" >{{ photo.title }}</div> ",
                styles: [":host { display: block; position: relative; width: 100%; height: 100%; } :host ion-scroll { width: 100%; height: 100%; text-align: left; white-space: nowrap; } :host ion-scroll /deep/ .scroll-zoom-wrapper { width: 100%; height: 100%; } :host ion-scroll .image { display: inline-block; position: relative; min-width: 100%; min-height: 100%; transform-origin: left top; background-repeat: no-repeat; background-position: center center; background-size: contain; text-align: left; vertical-align: top; } :host ion-scroll .image fitted-image { transform-origin: left top; pointer-events: none; } :host .fitted-image-title { position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background-color: rgba(0, 0, 0, 0.3); color: white; font-size: 14px; line-height: 18px; text-align: center; z-index: 1; } "],
            },] },
];
/**
 * @nocollapse
 */
ZoomableImage.ctorParameters = () => [];
ZoomableImage.propDecorators = {
    'ionScrollContainer': [{ type: ViewChild, args: ['ionScrollContainer', { read: ElementRef },] },],
    'photo': [{ type: Input },],
    'resizeTriggerer': [{ type: Input },],
    'wrapperWidth': [{ type: Input },],
    'wrapperHeight': [{ type: Input },],
    'disableScroll': [{ type: Output },],
    'enableScroll': [{ type: Output },],
    'zoomChange': [{ type: Output },],
};
function ZoomableImage_tsickle_Closure_declarations() {
    /** @type {?} */
    ZoomableImage.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ZoomableImage.ctorParameters;
    /** @type {?} */
    ZoomableImage.propDecorators;
    /** @type {?} */
    ZoomableImage.prototype.ionScrollContainer;
    /** @type {?} */
    ZoomableImage.prototype.photo;
    /** @type {?} */
    ZoomableImage.prototype.resizeTriggerer;
    /** @type {?} */
    ZoomableImage.prototype.wrapperWidth;
    /** @type {?} */
    ZoomableImage.prototype.wrapperHeight;
    /** @type {?} */
    ZoomableImage.prototype.disableScroll;
    /** @type {?} */
    ZoomableImage.prototype.enableScroll;
    /** @type {?} */
    ZoomableImage.prototype.zoomChange;
    /** @type {?} */
    ZoomableImage.prototype.scrollableElement;
    /** @type {?} */
    ZoomableImage.prototype.scrollListener;
    /** @type {?} */
    ZoomableImage.prototype.scale;
    /** @type {?} */
    ZoomableImage.prototype.scaleStart;
    /** @type {?} */
    ZoomableImage.prototype.maxScale;
    /** @type {?} */
    ZoomableImage.prototype.minScale;
    /** @type {?} */
    ZoomableImage.prototype.minScaleBounce;
    /** @type {?} */
    ZoomableImage.prototype.maxScaleBounce;
    /** @type {?} */
    ZoomableImage.prototype.imageWidth;
    /** @type {?} */
    ZoomableImage.prototype.imageHeight;
    /** @type {?} */
    ZoomableImage.prototype.originalSize;
    /** @type {?} */
    ZoomableImage.prototype.position;
    /** @type {?} */
    ZoomableImage.prototype.scroll;
    /** @type {?} */
    ZoomableImage.prototype.centerRatio;
    /** @type {?} */
    ZoomableImage.prototype.centerStart;
    /** @type {?} */
    ZoomableImage.prototype.panCenterStart;
    /** @type {?} */
    ZoomableImage.prototype.containerStyle;
    /** @type {?} */
    ZoomableImage.prototype.imageStyle;
    /** @type {?} */
    ZoomableImage.prototype.resizeSubscription;
}
