import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, Input, NgModule, Optional, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule, ESCAPE, TemplatePortal, isFakeMousedownFromScreenReader } from '@angular/cdk';
import { Directionality, MdCommonModule, MdRippleModule, Overlay, OverlayModule, OverlayState } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * Throws an exception for the case when popover trigger doesn't have a valid mde-popover instance
 * \@docs-private
 * @return {?}
 */
function throwMdePopoverMissingError() {
    throw Error(`mde-popover-trigger: must pass in an mde-popover instance.

    Example:
      <mde-popover #popover="mdPopover"></mde-popover>
      <button [mdPopoverTriggerFor]="popover"></button>`);
}
/**
 * Throws an exception for the case when popover's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * \@docs-private
 * @return {?}
 */
function throwMdePopoverInvalidPositionX() {
    throw Error(`x-position value must be either 'before' or after'.
      Example: <mde-popover x-position="before" #popover="mdPopover"></mde-popover>`);
}
/**
 * Throws an exception for the case when popover's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * \@docs-private
 * @return {?}
 */
function throwMdePopoverInvalidPositionY() {
    throw Error(`y-position value must be either 'above' or below'.
      Example: <mde-popover y-position="above" #popover="mdPopover"></mde-popover>`);
}

/**
 * This animation controls the popover panel's entry and exit from the page.
 *
 * When the popover panel is added to the DOM, it scales in and fades in its border.
 *
 * When the popover panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
const transformPopover = trigger('transformPopover', [
    state('enter', style({
        opacity: 1,
        transform: `scale(1)`
    })),
    transition('void => *', [
        style({
            opacity: 0,
            transform: `scale(0)`
        }),
        animate(`200ms cubic-bezier(0.25, 0.8, 0.25, 1)`)
    ]),
    transition('* => void', [
        animate('50ms 100ms linear', style({ opacity: 0 }))
    ])
]);

class MdePopover {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
        /**
         * Settings for popover, view setters and getters for more detail
         */
        this._positionX = 'after';
        this._positionY = 'below';
        this._triggerEvent = 'hover';
        this._enterDelay = 200;
        this._leaveDelay = 0;
        this._overlapTrigger = true;
        this._targetOffsetX = 0;
        this._targetOffsetY = 0;
        this._arrowOffsetX = 20;
        this._arrowWidth = 8;
        this._arrowColor = 'rgba(0, 0, 0, 0.12)';
        this._closeOnClick = true;
        this._focusTrapEnabled = true;
        /**
         * Config object to be passed into the popover's ngClass
         */
        this._classList = {};
        /**
         *
         */
        this.containerPositioning = false;
        /**
         * Closing disabled on popover
         */
        this.closeDisabled = false;
        /**
         * Emits the current animation state whenever it changes.
         */
        this._onAnimationStateChange = new EventEmitter();
        /**
         * Event emitted when the popover is closed.
         */
        this.close = new EventEmitter();
        this.setPositionClasses();
    }
    /**
     * Position of the popover in the X axis.
     * @return {?}
     */
    get positionX() { return this._positionX; }
    /**
     * @param {?} value
     * @return {?}
     */
    set positionX(value) {
        if (value !== 'before' && value !== 'after') {
            throwMdePopoverInvalidPositionX();
        }
        this._positionX = value;
        this.setPositionClasses();
    }
    /**
     * Position of the popover in the Y axis.
     * @return {?}
     */
    get positionY() { return this._positionY; }
    /**
     * @param {?} value
     * @return {?}
     */
    set positionY(value) {
        if (value !== 'above' && value !== 'below') {
            throwMdePopoverInvalidPositionY();
        }
        this._positionY = value;
        this.setPositionClasses();
    }
    /**
     * Popover trigger event
     * @return {?}
     */
    get triggerEvent() { return this._triggerEvent; }
    /**
     * @param {?} v
     * @return {?}
     */
    set triggerEvent(v) { this._triggerEvent = v; }
    /**
     * Popover enter delay
     * @return {?}
     */
    get enterDelay() { return this._enterDelay; }
    /**
     * @param {?} v
     * @return {?}
     */
    set enterDelay(v) { this._enterDelay = v; }
    /**
     * Popover leave delay
     * @return {?}
     */
    get leaveDelay() { return this._enterDelay; }
    /**
     * @param {?} v
     * @return {?}
     */
    set leaveDelay(v) { this._enterDelay = v; }
    /**
     * Popover overlap trigger
     * @return {?}
     */
    get overlapTrigger() { return this._overlapTrigger; }
    /**
     * @param {?} v
     * @return {?}
     */
    set overlapTrigger(v) { this._overlapTrigger = v; }
    /**
     * Popover target offset x
     * @return {?}
     */
    get targetOffsetX() { return this._targetOffsetX; }
    /**
     * @param {?} v
     * @return {?}
     */
    set targetOffsetX(v) { this._targetOffsetX = v; }
    /**
     * Popover target offset y
     * @return {?}
     */
    get targetOffsetY() { return this._targetOffsetY; }
    /**
     * @param {?} v
     * @return {?}
     */
    set targetOffsetY(v) { this._targetOffsetY = v; }
    /**
     * Popover arrow offset x
     * @return {?}
     */
    get arrowOffsetX() { return this._arrowOffsetX; }
    /**
     * @param {?} v
     * @return {?}
     */
    set arrowOffsetX(v) { this._arrowOffsetX = v; }
    /**
     * Popover arrow width
     * @return {?}
     */
    get arrowWidth() { return this._arrowWidth; }
    /**
     * @param {?} v
     * @return {?}
     */
    set arrowWidth(v) { this._arrowWidth = v; }
    /**
     * Popover arrow color
     * @return {?}
     */
    get arrowColor() { return this._arrowColor; }
    /**
     * @param {?} v
     * @return {?}
     */
    set arrowColor(v) { this._arrowColor = v; }
    /**
     * Popover container close on click
     * default: true
     * @return {?}
     */
    get closeOnClick() { return this._closeOnClick; }
    /**
     * @param {?} v
     * @return {?}
     */
    set closeOnClick(v) { this._closeOnClick = v; }
    /**
     * Popover focus trap using cdkTrapFocus
     * default: true
     * @return {?}
     */
    get focusTrapEnabled() { return this._focusTrapEnabled; }
    /**
     * @param {?} v
     * @return {?}
     */
    set focusTrapEnabled(v) { this._focusTrapEnabled = v; }
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @return {?}
     */
    get classList() { return this._classList; }
    /**
     * @param {?} classes
     * @return {?}
     */
    set classList(classes) {
        if (classes && classes.length) {
            this._classList = classes.split(' ').reduce((obj, className) => {
                obj[className] = true;
                return obj;
            }, {});
            this._elementRef.nativeElement.className = '';
            this.setPositionClasses();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._emitCloseEvent();
        this.close.complete();
    }
    /**
     * Handle a keyboard event from the popover, delegating to the appropriate action.
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        switch (event.keyCode) {
            case ESCAPE:
                this._emitCloseEvent();
                return;
        }
    }
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the popover.
     * @return {?}
     */
    _emitCloseEvent() {
        this.close.emit();
    }
    /**
     * Close popover on click if closeOnClick is true
     * @return {?}
     */
    onClick() {
        if (this.closeOnClick) {
            this._emitCloseEvent();
        }
    }
    /**
     * Disables close of popover when leaving trigger element and mouse over the popover
     * @return {?}
     */
    onMouseOver() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = true;
        }
    }
    /**
     * Enables close of popover when mouse leaving popover element
     * @return {?}
     */
    onMouseLeave() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = false;
            this._emitCloseEvent();
        }
    }
    /**
     * Sets the current styles for the popover to allow for dynamically changing settings
     * @return {?}
     */
    setCurrentStyles() {
        // TODO: See if arrow position can be calculated automatically and allow override.
        // TODO: See if flex order is a better alternative to position arrow top or bottom.
        this.popoverArrowStyles = {
            'right': this.positionX === 'before' ? (this.arrowOffsetX - this.arrowWidth) + 'px' : '',
            'left': this.positionX === 'after' ? (this.arrowOffsetX - this.arrowWidth) + 'px' : '',
            'border-top': this.positionY === 'below' ?
                this.arrowWidth + 'px solid ' + this.arrowColor : '0px solid transparent',
            'border-right': 'undefined' === undefined ?
                this.arrowWidth + 'px solid ' + this.arrowColor :
                this.arrowWidth + 'px solid transparent',
            'border-bottom': this.positionY === 'above' ?
                this.arrowWidth + 'px solid ' + this.arrowColor :
                this.arrowWidth + 'px solid transparent',
            'border-left': 'undefined' === undefined ?
                this.arrowWidth + 'px solid ' + this.arrowColor :
                this.arrowWidth + 'px solid transparent',
        };
        // TODO: Remove if flex order is added.
        this.popoverContentStyles = {
            'padding-top': this.overlapTrigger === true ? '0px' : this.arrowWidth + 'px',
            'padding-bottom': this.overlapTrigger === true ? '0px' : (this.arrowWidth) + 'px',
            'margin-top': this.overlapTrigger === false && this.positionY === 'below' && this.containerPositioning === false ?
                -(this.arrowWidth * 2) + 'px' : '0px'
        };
    }
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     * @param {?=} posX
     * @param {?=} posY
     * @return {?}
     */
    setPositionClasses(posX = this.positionX, posY = this.positionY) {
        this._classList['mde-popover-before'] = posX === 'before';
        this._classList['mde-popover-after'] = posX === 'after';
        this._classList['mde-popover-above'] = posY === 'above';
        this._classList['mde-popover-below'] = posY === 'below';
    }
}
MdePopover.decorators = [
    { type: Component, args: [{
                selector: 'mde-popover',
                template: "<ng-template> <div class=\"mde-popover-panel\" role=\"dialog\" [class.mde-popover-overlap]=\"overlapTrigger\" [ngClass]=\"_classList\" [ngStyle]=\"popoverPanelStyles\" (keydown)=\"_handleKeydown($event)\" (click)=\"onClick()\" (mouseover)=\"onMouseOver()\" (mouseleave)=\"onMouseLeave()\" [@transformPopover]=\"'enter'\"> <div class=\"mde-popover-direction-arrow\" [ngStyle]=\"popoverArrowStyles\" *ngIf=\"!overlapTrigger\"></div> <div class=\"mde-popover-content\" [ngStyle]=\"popoverContentStyles\" cdkTrapFocus=\"focusTrapEnabled\"> <ng-content></ng-content> </div> </div> </ng-template> ",
                styles: [".mde-popover-panel{display:flex;flex-direction:column;max-height:calc(100vh + 48px)}.mde-popover-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.mde-popover-below .mde-popover-direction-arrow{position:absolute;bottom:0;width:0;height:0;border-bottom-width:0 !important;z-index:99999}.mde-popover-above .mde-popover-direction-arrow{position:absolute;top:0px;width:0;height:0;border-top-width:0 !important;z-index:99999}.mde-popover-after .mde-popover-direction-arrow{left:20px}.mde-popover-before .mde-popover-direction-arrow{right:20px} /*# sourceMappingURL=popover.css.map */"],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: {
                    'role': 'dialog'
                },
                animations: [
                    transformPopover
                ],
                exportAs: 'mdePopover'
            },] },
];
/**
 * @nocollapse
 */
MdePopover.ctorParameters = () => [
    { type: ElementRef, },
];
MdePopover.propDecorators = {
    'positionX': [{ type: Input, args: ['mdePopoverPositionX',] },],
    'positionY': [{ type: Input, args: ['mdePopoverPositionY',] },],
    'triggerEvent': [{ type: Input, args: ['mdePopoverTriggerOn',] },],
    'enterDelay': [{ type: Input, args: ['mdePopoverEnterDelay',] },],
    'leaveDelay': [{ type: Input, args: ['mdePopoverLeaveDelay',] },],
    'overlapTrigger': [{ type: Input, args: ['mdePopoverOverlapTrigger',] },],
    'targetOffsetX': [{ type: Input, args: ['mdePopoverOffsetX',] },],
    'targetOffsetY': [{ type: Input, args: ['mdePopoverOffsetY',] },],
    'arrowOffsetX': [{ type: Input, args: ['mdePopoverArrowOffsetX',] },],
    'arrowWidth': [{ type: Input, args: ['mdePopoverArrowWidth',] },],
    'arrowColor': [{ type: Input, args: ['mdePopoverArrowColor',] },],
    'closeOnClick': [{ type: Input, args: ['mdePopoverCloseOnClick',] },],
    'focusTrapEnabled': [{ type: Input, args: ['mdeFocusTrapEnabled',] },],
    'classList': [{ type: Input, args: ['class',] },],
    'close': [{ type: Output },],
    'templateRef': [{ type: ViewChild, args: [TemplateRef,] },],
};

/**
 * This directive is intended to be used in conjunction with an md-popover tag.  It is
 * responsible for toggling the display of the provided popover instance.
 */
class MdePopoverTrigger {
    /**
     * @param {?} _overlay
     * @param {?} _element
     * @param {?} _viewContainerRef
     * @param {?} _dir
     */
    constructor(_overlay, _element, _viewContainerRef, _dir) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._overlayRef = null;
        this._popoverOpen = false;
        this._openedByMouse = false;
        /**
         * Event emitted when the associated popover is opened.
         */
        this.onPopoverOpen = new EventEmitter();
        /**
         * Event emitted when the associated popover is closed.
         */
        this.onPopoverClose = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this._checkPopover();
        this._setCurrentConfig();
        this.popover.close.subscribe(() => this.closePopover());
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.destroyPopover(); }
    /**
     * @return {?}
     */
    _setCurrentConfig() {
        if (this.positionX === 'before' || this.positionX === 'after') {
            this.popover.positionX = this.positionX;
        }
        if (this.positionY === 'above' || this.positionY === 'below') {
            this.popover.positionY = this.positionY;
        }
        if (this.triggerEvent) {
            this.popover.triggerEvent = this.triggerEvent;
        }
        if (this.enterDelay) {
            this.popover.enterDelay = this.enterDelay;
        }
        if (this.leaveDelay) {
            this.popover.leaveDelay = this.leaveDelay;
        }
        if (this.overlapTrigger === true || this.overlapTrigger === false) {
            this.popover.overlapTrigger = this.overlapTrigger;
        }
        if (this.targetOffsetX) {
            this.popover.targetOffsetX = this.targetOffsetX;
        }
        if (this.targetOffsetY) {
            this.popover.targetOffsetY = this.targetOffsetY;
        }
        if (this.arrowOffsetX) {
            this.popover.arrowOffsetX = this.arrowOffsetX;
        }
        if (this.arrowWidth) {
            this.popover.arrowWidth = this.arrowWidth;
        }
        if (this.arrowColor) {
            this.popover.arrowColor = this.arrowColor;
        }
        if (this.closeOnClick === true || this.closeOnClick === false) {
            this.popover.closeOnClick = this.closeOnClick;
        }
        this.popover.setCurrentStyles();
    }
    /**
     * Whether the popover is open.
     * @return {?}
     */
    get popoverOpen() { return this._popoverOpen; }
    /**
     * @return {?}
     */
    onClick() {
        if (this.popover.triggerEvent === 'click') {
            // this.popover.setCurrentStyles();
            // this._setCurrentConfig();
            this.togglePopover();
        }
    }
    /**
     * @return {?}
     */
    onMouseOver() {
        if (this.popover.triggerEvent === 'hover') {
            this._mouseoverTimer = setTimeout(() => {
                this.openPopover();
            }, this.popover.enterDelay);
        }
    }
    /**
     * @return {?}
     */
    onMouseLeave() {
        if (this.popover.triggerEvent === 'hover') {
            if (this._mouseoverTimer) {
                clearTimeout(this._mouseoverTimer);
                this._mouseoverTimer = null;
            }
            if (this._popoverOpen) {
                setTimeout(() => {
                    if (!this.popover.closeDisabled) {
                        this.closePopover();
                    }
                }, this.popover.leaveDelay);
            }
        }
    }
    /**
     * Toggles the popover between the open and closed states.
     * @return {?}
     */
    togglePopover() {
        return this._popoverOpen ? this.closePopover() : this.openPopover();
    }
    /**
     * Opens the popover.
     * @return {?}
     */
    openPopover() {
        if (!this._popoverOpen) {
            this._createOverlay().attach(this._portal);
            /** Only subscribe to backdrop if trigger event is click */
            if (this.triggerEvent === 'click') {
                this._subscribeToBackdrop();
            }
            this._initPopover();
        }
    }
    /**
     * Closes the popover.
     * @return {?}
     */
    closePopover() {
        if (this._overlayRef) {
            this._overlayRef.detach();
            /** Only unsubscribe to backdrop if trigger event is click */
            if (this.triggerEvent === 'click') {
                this._backdropSubscription.unsubscribe();
            }
            this._resetPopover();
        }
    }
    /**
     * Removes the popover from the DOM.
     * @return {?}
     */
    destroyPopover() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
            this._cleanUpSubscriptions();
        }
    }
    /**
     * Focuses the popover trigger.
     * @return {?}
     */
    focus() {
        this._element.nativeElement.focus();
    }
    /**
     * The text direction of the containing app.
     * @return {?}
     */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /**
     * This method ensures that the popover closes when the overlay backdrop is clicked.
     * We do not use first() here because doing so would not catch clicks from within
     * the popover, and it would fail to unsubscribe properly. Instead, we unsubscribe
     * explicitly when the popover is closed or destroyed.
     * @return {?}
     */
    _subscribeToBackdrop() {
        if (this._overlayRef) {
            this._backdropSubscription = this._overlayRef.backdropClick().subscribe(() => {
                this.popover._emitCloseEvent();
            });
        }
    }
    /**
     * This method sets the popover state to open and focuses the first item if
     * the popover was opened via the keyboard.
     * @return {?}
     */
    _initPopover() {
        this._setIsPopoverOpen(true);
    }
    /**
     * This method resets the popover when it's closed, most importantly restoring
     * focus to the popover trigger if the popover was opened via the keyboard.
     * @return {?}
     */
    _resetPopover() {
        this._setIsPopoverOpen(false);
        // Focus only needs to be reset to the host element if the popover was opened
        // by the keyboard and manually shifted to the first popover item.
        if (!this._openedByMouse) {
            this.focus();
        }
        this._openedByMouse = false;
    }
    /**
     * set state rather than toggle to support triggers sharing a popover
     * @param {?} isOpen
     * @return {?}
     */
    _setIsPopoverOpen(isOpen) {
        this._popoverOpen = isOpen;
        this._popoverOpen ? this.onPopoverOpen.emit() : this.onPopoverClose.emit();
    }
    /**
     *  This method checks that a valid instance of MdPopover has been passed into
     *  mdPopoverTriggerFor. If not, an exception is thrown.
     * @return {?}
     */
    _checkPopover() {
        if (!this.popover) {
            throwMdePopoverMissingError();
        }
    }
    /**
     *  This method creates the overlay from the provided popover's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openPopover is called.
     * @return {?}
     */
    _createOverlay() {
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.popover.templateRef, this._viewContainerRef);
            const /** @type {?} */ config = this._getOverlayConfig();
            this._subscribeToPositions(/** @type {?} */ (config.positionStrategy));
            this._overlayRef = this._overlay.create(config);
        }
        return this._overlayRef;
    }
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @return {?} OverlayState
     */
    _getOverlayConfig() {
        const /** @type {?} */ overlayState = new OverlayState();
        overlayState.positionStrategy = this._getPosition()
            .withDirection(this.dir);
        /** Display overlay backdrop if trigger event is click */
        if (this.triggerEvent === 'click') {
            overlayState.hasBackdrop = true;
            overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
        }
        overlayState.direction = this.dir;
        overlayState.scrollStrategy = this._overlay.scrollStrategies.reposition();
        return overlayState;
    }
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the popover based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     * @param {?} position
     * @return {?}
     */
    _subscribeToPositions(position) {
        this._positionSubscription = position.onPositionChange.subscribe(change => {
            const /** @type {?} */ posisionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
            let /** @type {?} */ posisionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
            if (!this.popover.overlapTrigger) {
                posisionY = posisionY === 'below' ? 'above' : 'below';
            }
            this.popover.positionX = posisionX;
            this.popover.positionY = posisionY;
            this.popover.setCurrentStyles();
            this.popover.setPositionClasses(posisionX, posisionY);
        });
    }
    /**
     * This method builds the position strategy for the overlay, so the popover is properly connected
     * to the trigger.
     * @return {?} ConnectedPositionStrategy
     */
    _getPosition() {
        const [posX, fallbackX] = this.popover.positionX === 'before' ? ['end', 'start'] : ['start', 'end'];
        const [overlayY, fallbackOverlayY] = this.popover.positionY === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];
        let /** @type {?} */ originY = overlayY;
        let /** @type {?} */ fallbackOriginY = fallbackOverlayY;
        /** Reverse overlayY and fallbackOverlayY when overlapTrigger is false */
        if (!this.popover.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            fallbackOriginY = fallbackOverlayY === 'top' ? 'bottom' : 'top';
        }
        let /** @type {?} */ offsetX = 0;
        let /** @type {?} */ offsetY = 0;
        if (this.popover.targetOffsetX && !isNaN(Number(this.popover.targetOffsetX))) {
            offsetX = Number(this.popover.targetOffsetX);
            // offsetX = -16;
        }
        if (this.popover.targetOffsetY && !isNaN(Number(this.popover.targetOffsetY))) {
            offsetY = Number(this.popover.targetOffsetY);
            // offsetY = -10;
        }
        /**
         * For overriding position element, when mdePopoverTargetAt has a valid element reference.
         * Useful for sticking popover to parent element and offsetting arrow to trigger element.
         * If undefined defaults to the trigger element reference.
         */
        let element = this._element;
        if (typeof this.targetElement !== 'undefined') {
            this.popover.containerPositioning = true;
            element = this.targetElement._elementRef;
        }
        return this._overlay.position()
            .connectedTo(element, { originX: posX, originY: originY }, { overlayX: posX, overlayY: overlayY })
            .withFallbackPosition({ originX: fallbackX, originY: originY }, { overlayX: fallbackX, overlayY: overlayY })
            .withFallbackPosition({ originX: posX, originY: fallbackOriginY }, { overlayX: posX, overlayY: fallbackOverlayY })
            .withFallbackPosition({ originX: fallbackX, originY: fallbackOriginY }, { overlayX: fallbackX, overlayY: fallbackOverlayY })
            .withOffsetX(offsetX)
            .withOffsetY(offsetY);
    }
    /**
     * @return {?}
     */
    _cleanUpSubscriptions() {
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleMousedown(event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
        }
    }
}
MdePopoverTrigger.decorators = [
    { type: Directive, args: [{
                selector: '[mdePopoverTriggerFor]',
                host: {
                    'aria-haspopup': 'true',
                    '(mouseover)': 'onMouseOver()',
                    '(mousedown)': '_handleMousedown($event)',
                    '(mouseleave)': 'onMouseLeave()',
                    '(click)': 'onClick()',
                },
                exportAs: 'mdePopoverTrigger'
            },] },
];
/**
 * @nocollapse
 */
MdePopoverTrigger.ctorParameters = () => [
    { type: Overlay, },
    { type: ElementRef, },
    { type: ViewContainerRef, },
    { type: Directionality, decorators: [{ type: Optional },] },
];
MdePopoverTrigger.propDecorators = {
    'popover': [{ type: Input, args: ['mdePopoverTriggerFor',] },],
    'targetElement': [{ type: Input, args: ['mdePopoverTargetAt',] },],
    'positionX': [{ type: Input, args: ['mdePopoverPositionX',] },],
    'positionY': [{ type: Input, args: ['mdePopoverPositionY',] },],
    'triggerEvent': [{ type: Input, args: ['mdePopoverTriggerOn',] },],
    'enterDelay': [{ type: Input, args: ['mdePopoverEnterDelay',] },],
    'leaveDelay': [{ type: Input, args: ['mdePopoverLeaveDelay',] },],
    'overlapTrigger': [{ type: Input, args: ['mdePopoverOverlapTrigger',] },],
    'targetOffsetX': [{ type: Input, args: ['mdePopoverOffsetX',] },],
    'targetOffsetY': [{ type: Input, args: ['mdePopoverOffsetY',] },],
    'arrowOffsetX': [{ type: Input, args: ['mdePopoverArrowOffsetX',] },],
    'arrowWidth': [{ type: Input, args: ['mdePopoverArrowWidth',] },],
    'arrowColor': [{ type: Input, args: ['mdePopoverArrowColor',] },],
    'closeOnClick': [{ type: Input, args: ['mdePopoverCloseOnClick',] },],
    'onPopoverOpen': [{ type: Output },],
    'onPopoverClose': [{ type: Output },],
};

class MdePopoverModule {
}
MdePopoverModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    OverlayModule,
                    CommonModule,
                    MdRippleModule,
                    MdCommonModule,
                    A11yModule
                ],
                exports: [MdePopover, MdePopoverTrigger, MdCommonModule],
                declarations: [MdePopover, MdePopoverTrigger],
            },] },
];
/**
 * @nocollapse
 */
MdePopoverModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdePopoverModule, MdePopover as ɵa, transformPopover as ɵc, MdePopoverTrigger as ɵb };
//# sourceMappingURL=mde.js.map
