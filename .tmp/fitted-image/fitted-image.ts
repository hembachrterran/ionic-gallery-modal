import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';;

@Component({
  selector: 'fitted-image',
  template: "<div class=\"fitted-image\"> <ion-spinner [hidden]=\"!loading\"></ion-spinner> <img [src]=\"photo.url\" [ngStyle]=\"imageStyle\" (load)=\"imageLoad($event)\" [hidden]=\"loading\" alt=\"\" /> </div> ",
  styles: [":host { display: inline-block; } :host .fitted-image { display: inline-block; position: relative; transform-origin: left top; background-repeat: no-repeat; background-position: center center; background-size: contain; text-align: left; vertical-align: top; } :host .fitted-image ion-spinner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } :host .fitted-image img { display: inline-block; min-width: 0; max-width: none; transform-origin: left top; vertical-align: top; pointer-events: none; } "],
})
export class FittedImage implements OnInit, OnDestroy {
  @Input() photo: any;
  @Input() resizeTriggerer: Subject<any>;
  @Input() wrapperWidth: number;
  @Input() wrapperHeight: number;

  @Output() onImageResized = new EventEmitter();

  private loading: boolean = true;

  private currentDimensions: any = {
    width: 0,
    height: 0,
  };

  private originalDimensions: any = {
    width: 0,
    height: 0,
  };

  private imageStyle: any = {};
  private resizeSubscription: any;

  constructor() {
  }

  public ngOnInit() {
    // Listen to parent resize
    if (this.resizeTriggerer)
      this.resizeSubscription = this.resizeTriggerer.subscribe(event => {
        this.resize(event);
      });
  }

  public ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  /**
   * Called every time the window gets resized
   */
  public resize(event) {
    // Save the image dimensions
    this.saveImageDimensions();
  }

  /**
   * Get the real image dimensions and other useful stuff
   */
  private imageLoad(event) {
    // Save the original dimensions
    this.originalDimensions.width = event.target.width;
    this.originalDimensions.height = event.target.height;

    this.saveImageDimensions();

    // Mark as not loading anymore
    this.loading = false;
  }

  /**
   * Save the image dimensions (when it has the image)
   */
  private saveImageDimensions() {
    const width = this.originalDimensions.width;
    const height = this.originalDimensions.height;

    if (width / height > this.wrapperWidth / this.wrapperHeight) {
      this.currentDimensions.width = this.wrapperWidth;
      this.currentDimensions.height = height / width * this.wrapperWidth;
    } else {
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
