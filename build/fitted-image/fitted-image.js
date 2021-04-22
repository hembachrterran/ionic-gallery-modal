import { Component, Input, Output, EventEmitter } from '@angular/core';
;
export class FittedImage {
    constructor() {
        this.onImageResized = new EventEmitter();
        this.loading = true;
        this.currentDimensions = {
            width: 0,
            height: 0,
        };
        this.originalDimensions = {
            width: 0,
            height: 0,
        };
        this.imageStyle = {};
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Listen to parent resize
        if (this.resizeTriggerer)
            this.resizeSubscription = this.resizeTriggerer.subscribe(event => {
                this.resize(event);
            });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
    }
    /**
     * Called every time the window gets resized
     * @param {?} event
     * @return {?}
     */
    resize(event) {
        // Save the image dimensions
        this.saveImageDimensions();
    }
    /**
     * Get the real image dimensions and other useful stuff
     * @param {?} event
     * @return {?}
     */
    imageLoad(event) {
        // Save the original dimensions
        this.originalDimensions.width = event.target.width;
        this.originalDimensions.height = event.target.height;
        this.saveImageDimensions();
        // Mark as not loading anymore
        this.loading = false;
    }
    /**
     * Save the image dimensions (when it has the image)
     * @return {?}
     */
    saveImageDimensions() {
        const /** @type {?} */ width = this.originalDimensions.width;
        const /** @type {?} */ height = this.originalDimensions.height;
        if (width / height > this.wrapperWidth / this.wrapperHeight) {
            this.currentDimensions.width = this.wrapperWidth;
            this.currentDimensions.height = height / width * this.wrapperWidth;
        }
        else {
            this.currentDimensions.height = this.wrapperHeight;
            this.currentDimensions.width = width / height * this.wrapperHeight;
        }
        this.imageStyle.width = `${this.currentDimensions.width}px`;
        this.imageStyle.height = `${this.currentDimensions.height}px`;
        this.onImageResized.emit({
            width: this.currentDimensions.width,
            height: this.currentDimensions.height,
            originalWidth: this.originalDimensions.width,
            originalHeight: this.originalDimensions.height,
        });
    }
}
FittedImage.decorators = [
    { type: Component, args: [{
                selector: 'fitted-image',
                template: "<div class=\"fitted-image\"> <ion-spinner [hidden]=\"!loading\"></ion-spinner> <img [src]=\"photo.url\" [ngStyle]=\"imageStyle\" (load)=\"imageLoad($event)\" [hidden]=\"loading\" alt=\"\" /> </div> ",
                styles: [":host { display: inline-block; } :host .fitted-image { display: inline-block; position: relative; transform-origin: left top; background-repeat: no-repeat; background-position: center center; background-size: contain; text-align: left; vertical-align: top; } :host .fitted-image ion-spinner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } :host .fitted-image img { display: inline-block; min-width: 0; max-width: none; transform-origin: left top; vertical-align: top; pointer-events: none; } "],
            },] },
];
/**
 * @nocollapse
 */
FittedImage.ctorParameters = () => [];
FittedImage.propDecorators = {
    'photo': [{ type: Input },],
    'resizeTriggerer': [{ type: Input },],
    'wrapperWidth': [{ type: Input },],
    'wrapperHeight': [{ type: Input },],
    'onImageResized': [{ type: Output },],
};
function FittedImage_tsickle_Closure_declarations() {
    /** @type {?} */
    FittedImage.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    FittedImage.ctorParameters;
    /** @type {?} */
    FittedImage.propDecorators;
    /** @type {?} */
    FittedImage.prototype.photo;
    /** @type {?} */
    FittedImage.prototype.resizeTriggerer;
    /** @type {?} */
    FittedImage.prototype.wrapperWidth;
    /** @type {?} */
    FittedImage.prototype.wrapperHeight;
    /** @type {?} */
    FittedImage.prototype.onImageResized;
    /** @type {?} */
    FittedImage.prototype.loading;
    /** @type {?} */
    FittedImage.prototype.currentDimensions;
    /** @type {?} */
    FittedImage.prototype.originalDimensions;
    /** @type {?} */
    FittedImage.prototype.imageStyle;
    /** @type {?} */
    FittedImage.prototype.resizeSubscription;
}
