import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as Gesture from 'angular-hammer';
export class TouchEventsDirective {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this.direction = 'x';
        this.threshold = 10;
        this.pinch = new EventEmitter();
        this.pinchstart = new EventEmitter();
        this.pinchend = new EventEmitter();
        this.onpan = new EventEmitter();
        this.panup = new EventEmitter();
        this.pandown = new EventEmitter();
        this.panleft = new EventEmitter();
        this.panright = new EventEmitter();
        this.panend = new EventEmitter();
        this.pancancel = new EventEmitter();
        this.doubletap = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.gestureListener = new Gesture(this.el.nativeElement, {
            domEvents: false,
            enable: true,
            direction: this.direction,
            threshold: this.threshold,
        });
        this.gestureListener.listen();
        this.gestureListener.on('pinch', (event) => {
            this.pinch.emit(event);
        });
        this.gestureListener.on('pinchstart', (event) => {
            this.pinchstart.emit(event);
        });
        this.gestureListener.on('pinchend', (event) => {
            this.pinchend.emit(event);
        });
        this.gestureListener.on('pan', (event) => {
            this.onpan.emit(event);
        });
        this.gestureListener.on('panup', (event) => {
            this.panup.emit(event);
        });
        this.gestureListener.on('pandown', (event) => {
            this.pandown.emit(event);
        });
        this.gestureListener.on('panleft', (event) => {
            this.panleft.emit(event);
        });
        this.gestureListener.on('panright', (event) => {
            this.panright.emit(event);
        });
        this.gestureListener.on('panend', (event) => {
            this.panend.emit(event);
        });
        this.gestureListener.on('pancancel', (event) => {
            this.pancancel.emit(event);
        });
        this.gestureListener.on('doubletap', (event) => {
            this.doubletap.emit(event);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.gestureListener.destroy();
    }
}
TouchEventsDirective.decorators = [
    { type: Directive, args: [{
                selector: '[touch-events]'
            },] },
];
/**
 * @nocollapse
 */
TouchEventsDirective.ctorParameters = () => [
    { type: ElementRef, },
];
TouchEventsDirective.propDecorators = {
    'direction': [{ type: Input },],
    'threshold': [{ type: Input },],
    'pinch': [{ type: Output },],
    'pinchstart': [{ type: Output },],
    'pinchend': [{ type: Output },],
    'onpan': [{ type: Output },],
    'panup': [{ type: Output },],
    'pandown': [{ type: Output },],
    'panleft': [{ type: Output },],
    'panright': [{ type: Output },],
    'panend': [{ type: Output },],
    'pancancel': [{ type: Output },],
    'doubletap': [{ type: Output },],
};
function TouchEventsDirective_tsickle_Closure_declarations() {
    /** @type {?} */
    TouchEventsDirective.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TouchEventsDirective.ctorParameters;
    /** @type {?} */
    TouchEventsDirective.propDecorators;
    /** @type {?} */
    TouchEventsDirective.prototype.gestureListener;
    /** @type {?} */
    TouchEventsDirective.prototype.direction;
    /** @type {?} */
    TouchEventsDirective.prototype.threshold;
    /** @type {?} */
    TouchEventsDirective.prototype.pinch;
    /** @type {?} */
    TouchEventsDirective.prototype.pinchstart;
    /** @type {?} */
    TouchEventsDirective.prototype.pinchend;
    /** @type {?} */
    TouchEventsDirective.prototype.onpan;
    /** @type {?} */
    TouchEventsDirective.prototype.panup;
    /** @type {?} */
    TouchEventsDirective.prototype.pandown;
    /** @type {?} */
    TouchEventsDirective.prototype.panleft;
    /** @type {?} */
    TouchEventsDirective.prototype.panright;
    /** @type {?} */
    TouchEventsDirective.prototype.panend;
    /** @type {?} */
    TouchEventsDirective.prototype.pancancel;
    /** @type {?} */
    TouchEventsDirective.prototype.doubletap;
    /** @type {?} */
    TouchEventsDirective.prototype.el;
}
