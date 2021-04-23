import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, NavParams, IonSlides, Platform } from '@ionic/angular';
import { Photo } from '../interfaces/photo-interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'gallery-modal',
  templateUrl: './gallery-modal.html',
  styleUrls: ['./gallery-modal.scss'],
})
export class GalleryModal implements OnInit {
  @Input() photos: Photo[] = [];
  @Input() initialSlide: number = 0;
  @Input() closeIcon: string = 'arrow-back';
  @ViewChild('slider') slider: IonSlides;

  public initialImage: any;

  public sliderDisabled: boolean = false;
  public currentSlide: number = 0;
  public sliderLoaded: boolean = false;
  public resizeTriggerer: Subject<any> = new Subject();
  public slidesDragging: boolean = false;
  public panUpDownRatio: number = 0;
  public panUpDownDeltaY: number = 0;
  public dismissed: boolean = false;

  public width: number = 0;
  public height: number = 0;

  public slidesStyle: any = {
    visibility: 'hidden',
  };
  public modalStyle: any = {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  };
  public sliderOptions: any;

  public transitionDuration: string = '200ms';
  public transitionTimingFunction: string = 'cubic-bezier(0.33, 0.66, 0.66, 1)';

  constructor(private viewCtrl: ModalController, params: NavParams, private element: ElementRef, private platform: Platform, private domSanitizer: DomSanitizer) {

    this.initialImage = this.photos[this.initialSlide] || {};
    this.sliderOptions = {
      initialSlide: this.initialSlide
    };
  }

  public ngOnInit() {
    // call resize on init
    this.resize({});
  }

  /**
   * Closes the modal (when user click on CLOSE)
   */
  public async dismiss() {
    const modal = await this.viewCtrl.getTop();
    modal.dismiss();
  }

  public resize(event) {
    if (this.slider)
      this.slider.update();

    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;

    this.resizeTriggerer.next({
      width: this.width,
      height: this.height,
    });
  }

  public orientationChange(event) {
    // TODO: See if you can remove timeout
    window.setTimeout(() => {
      this.resize(event);
    }, 150);
  }

  /**
   * When the modal has entered into view
   */
  public ionViewDidEnter() {
    this.resize(false);
    this.sliderLoaded = true;
    this.slidesStyle.visibility = 'visible';
  }

  /**
   * Disables the scroll through the slider
   *
   * @param  {Event} event
   */
  public async disableScroll(event) {
    if (!this.sliderDisabled) {
      this.currentSlide = await this.slider.getActiveIndex();
      this.sliderDisabled = true;
    }
  }

  /**
   * Enables the scroll through the slider
   *
   * @param  {Event} event
   */
  public enableScroll(event) {
    if (this.sliderDisabled) {
      this.slider.slideTo(this.currentSlide, 0, false);
      this.sliderDisabled = false;
    }
  }

  /**
   * Called while dragging to close modal
   *
   * @param  {Event} event
   */
  public slidesDrag(event) {
    this.slidesDragging = true;
  }

  /**
   * Called when the user pans up/down
   *
   * @param  {Hammer.Event} event
   */
  public panUpDownEvent(event) {
    event.preventDefault();

    if (this.slidesDragging || this.sliderDisabled) {
      return;
    }

    let ratio = (event.distance / (this.height / 2));
    if (ratio > 1) {
      ratio = 1;
    } else if (ratio < 0) {
      ratio = 0;
    }
    const scale = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.2));
    const opacity = (event.deltaY < 0 ? 1 - (ratio * 0.5) : 1 - (ratio * 0.2));
    const backgroundOpacity = (event.deltaY < 0 ? 1 : 1 - (ratio * 0.8));

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
   * @param  {Hammer.Event} event
   */
  public panEndEvent(event) {
    this.slidesDragging = false;

    this.panUpDownRatio += event.velocityY * 30;

    if (this.panUpDownRatio >= 0.65 && this.panUpDownDeltaY > 0) {
      if (!this.dismissed) {
        this.dismiss();
      }
      this.dismissed = true;
    } else {
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

  closeModal() {
    this.viewCtrl.dismiss({
      'dismissed': true
    });
  }

}
