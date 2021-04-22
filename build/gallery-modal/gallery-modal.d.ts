import { OnInit, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, NavParams, IonSlides, Platform } from '@ionic/angular';
import { Photo } from '../interfaces/photo-interface';
export declare class GalleryModal implements OnInit {
    private viewCtrl;
    private element;
    private platform;
    private domSanitizer;
    slider: IonSlides;
    private initialImage;
    photos: Photo[];
    private sliderDisabled;
    private initialSlide;
    private currentSlide;
    private sliderLoaded;
    private closeIcon;
    private resizeTriggerer;
    private slidesDragging;
    private panUpDownRatio;
    private panUpDownDeltaY;
    private dismissed;
    private width;
    private height;
    private slidesStyle;
    private modalStyle;
    private transitionDuration;
    private transitionTimingFunction;
    constructor(viewCtrl: ModalController, params: NavParams, element: ElementRef, platform: Platform, domSanitizer: DomSanitizer);
    ngOnInit(): void;
    /**
     * Closes the modal (when user click on CLOSE)
     */
    dismiss(): Promise<void>;
    private resize;
    private orientationChange;
    /**
     * When the modal has entered into view
     */
    private ionViewDidEnter;
    /**
     * Disables the scroll through the slider
     *
     * @param  {Event} event
     */
    private disableScroll;
    /**
     * Enables the scroll through the slider
     *
     * @param  {Event} event
     */
    private enableScroll;
    /**
     * Called while dragging to close modal
     *
     * @param  {Event} event
     */
    private slidesDrag;
    /**
     * Called when the user pans up/down
     *
     * @param  {Hammer.Event} event
     */
    private panUpDownEvent;
    /**
     * Called when the user stopped panning up/down
     *
     * @param  {Hammer.Event} event
     */
    private panEndEvent;
}
