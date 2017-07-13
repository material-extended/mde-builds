(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/cdk'), require('@angular/material'), require('@angular/animations')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/cdk', '@angular/material', '@angular/animations'], factory) :
	(factory((global.mde = global.mde || {}),global.ng.core,global._angular_common,global._angular_cdk,global._angular_material,global._angular_animations));
}(this, (function (exports,_angular_core,_angular_common,_angular_cdk,_angular_material,_angular_animations) { 'use strict';

/**
 * Throws an exception for the case when popover trigger doesn't have a valid mde-popover instance
 * \@docs-private
 * @return {?}
 */
function throwMdePopoverMissingError() {
    throw Error("mde-popover-trigger: must pass in an mde-popover instance.\n\n    Example:\n      <mde-popover #popover=\"mdPopover\"></mde-popover>\n      <button [mdPopoverTriggerFor]=\"popover\"></button>");
}
/**
 * Throws an exception for the case when popover's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * \@docs-private
 * @return {?}
 */
function throwMdePopoverInvalidPositionX() {
    throw Error("x-position value must be either 'before' or after'.\n      Example: <mde-popover x-position=\"before\" #popover=\"mdPopover\"></mde-popover>");
}
/**
 * Throws an exception for the case when popover's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * \@docs-private
 * @return {?}
 */
function throwMdePopoverInvalidPositionY() {
    throw Error("y-position value must be either 'above' or below'.\n      Example: <mde-popover y-position=\"above\" #popover=\"mdPopover\"></mde-popover>");
}

/**
 * This animation controls the popover panel's entry and exit from the page.
 *
 * When the popover panel is added to the DOM, it scales in and fades in its border.
 *
 * When the popover panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
var transformPopover = _angular_animations.trigger('transformPopover', [
    _angular_animations.state('enter', _angular_animations.style({
        opacity: 1,
        transform: "scale(1)"
    })),
    _angular_animations.transition('void => *', [
        _angular_animations.style({
            opacity: 0,
            transform: "scale(0)"
        }),
        _angular_animations.animate("200ms cubic-bezier(0.25, 0.8, 0.25, 1)")
    ]),
    _angular_animations.transition('* => void', [
        _angular_animations.animate('50ms 100ms linear', _angular_animations.style({ opacity: 0 }))
    ])
]);

var MdePopover = (function () {
    /**
     * @param {?} _elementRef
     */
    function MdePopover(_elementRef) {
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
        this._onAnimationStateChange = new _angular_core.EventEmitter();
        /**
         * Event emitted when the popover is closed.
         */
        this.close = new _angular_core.EventEmitter();
        this.setPositionClasses();
    }
    Object.defineProperty(MdePopover.prototype, "positionX", {
        /**
         * Position of the popover in the X axis.
         * @return {?}
         */
        get: function () { return this._positionX; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== 'before' && value !== 'after') {
                throwMdePopoverInvalidPositionX();
            }
            this._positionX = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "positionY", {
        /**
         * Position of the popover in the Y axis.
         * @return {?}
         */
        get: function () { return this._positionY; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value !== 'above' && value !== 'below') {
                throwMdePopoverInvalidPositionY();
            }
            this._positionY = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "triggerEvent", {
        /**
         * Popover trigger event
         * @return {?}
         */
        get: function () { return this._triggerEvent; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._triggerEvent = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "enterDelay", {
        /**
         * Popover enter delay
         * @return {?}
         */
        get: function () { return this._enterDelay; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._enterDelay = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "leaveDelay", {
        /**
         * Popover leave delay
         * @return {?}
         */
        get: function () { return this._enterDelay; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._enterDelay = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "overlapTrigger", {
        /**
         * Popover overlap trigger
         * @return {?}
         */
        get: function () { return this._overlapTrigger; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._overlapTrigger = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "targetOffsetX", {
        /**
         * Popover target offset x
         * @return {?}
         */
        get: function () { return this._targetOffsetX; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._targetOffsetX = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "targetOffsetY", {
        /**
         * Popover target offset y
         * @return {?}
         */
        get: function () { return this._targetOffsetY; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._targetOffsetY = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "arrowOffsetX", {
        /**
         * Popover arrow offset x
         * @return {?}
         */
        get: function () { return this._arrowOffsetX; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._arrowOffsetX = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "arrowWidth", {
        /**
         * Popover arrow width
         * @return {?}
         */
        get: function () { return this._arrowWidth; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._arrowWidth = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "arrowColor", {
        /**
         * Popover arrow color
         * @return {?}
         */
        get: function () { return this._arrowColor; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._arrowColor = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "closeOnClick", {
        /**
         * Popover container close on click
         * default: true
         * @return {?}
         */
        get: function () { return this._closeOnClick; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._closeOnClick = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "focusTrapEnabled", {
        /**
         * Popover focus trap using cdkTrapFocus
         * default: true
         * @return {?}
         */
        get: function () { return this._focusTrapEnabled; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._focusTrapEnabled = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdePopover.prototype, "classList", {
        /**
         * This method takes classes set on the host md-popover element and applies them on the
         * popover template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing popover from outside the component.
         * @return {?}
         */
        get: function () { return this._classList; },
        /**
         * @param {?} classes
         * @return {?}
         */
        set: function (classes) {
            if (classes && classes.length) {
                this._classList = classes.split(' ').reduce(function (obj, className) {
                    obj[className] = true;
                    return obj;
                }, {});
                this._elementRef.nativeElement.className = '';
                this.setPositionClasses();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdePopover.prototype.ngOnDestroy = function () {
        this._emitCloseEvent();
        this.close.complete();
    };
    /**
     * Handle a keyboard event from the popover, delegating to the appropriate action.
     * @param {?} event
     * @return {?}
     */
    MdePopover.prototype._handleKeydown = function (event) {
        switch (event.keyCode) {
            case _angular_cdk.ESCAPE:
                this._emitCloseEvent();
                return;
        }
    };
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the popover.
     * @return {?}
     */
    MdePopover.prototype._emitCloseEvent = function () {
        this.close.emit();
    };
    /**
     * Close popover on click if closeOnClick is true
     * @return {?}
     */
    MdePopover.prototype.onClick = function () {
        if (this.closeOnClick) {
            this._emitCloseEvent();
        }
    };
    /**
     * Disables close of popover when leaving trigger element and mouse over the popover
     * @return {?}
     */
    MdePopover.prototype.onMouseOver = function () {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = true;
        }
    };
    /**
     * Enables close of popover when mouse leaving popover element
     * @return {?}
     */
    MdePopover.prototype.onMouseLeave = function () {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = false;
            this._emitCloseEvent();
        }
    };
    /**
     * Sets the current styles for the popover to allow for dynamically changing settings
     * @return {?}
     */
    MdePopover.prototype.setCurrentStyles = function () {
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
    };
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     * @param {?=} posX
     * @param {?=} posY
     * @return {?}
     */
    MdePopover.prototype.setPositionClasses = function (posX, posY) {
        if (posX === void 0) { posX = this.positionX; }
        if (posY === void 0) { posY = this.positionY; }
        this._classList['mde-popover-before'] = posX === 'before';
        this._classList['mde-popover-after'] = posX === 'after';
        this._classList['mde-popover-above'] = posY === 'above';
        this._classList['mde-popover-below'] = posY === 'below';
    };
    MdePopover.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'mde-popover',
                    template: "<ng-template> <div class=\"mde-popover-panel\" role=\"dialog\" [class.mde-popover-overlap]=\"overlapTrigger\" [ngClass]=\"_classList\" [ngStyle]=\"popoverPanelStyles\" (keydown)=\"_handleKeydown($event)\" (click)=\"onClick()\" (mouseover)=\"onMouseOver()\" (mouseleave)=\"onMouseLeave()\" [@transformPopover]=\"'enter'\"> <div class=\"mde-popover-direction-arrow\" [ngStyle]=\"popoverArrowStyles\" *ngIf=\"!overlapTrigger\"></div> <div class=\"mde-popover-content\" [ngStyle]=\"popoverContentStyles\" cdkTrapFocus=\"focusTrapEnabled\"> <ng-content></ng-content> </div> </div> </ng-template> ",
                    styles: [".mde-popover-panel{display:flex;flex-direction:column;max-height:calc(100vh + 48px)}.mde-popover-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.mde-popover-below .mde-popover-direction-arrow{position:absolute;bottom:0;width:0;height:0;border-bottom-width:0 !important;z-index:99999}.mde-popover-above .mde-popover-direction-arrow{position:absolute;top:0px;width:0;height:0;border-top-width:0 !important;z-index:99999}.mde-popover-after .mde-popover-direction-arrow{left:20px}.mde-popover-before .mde-popover-direction-arrow{right:20px} /*# sourceMappingURL=popover.css.map */"],
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
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
    MdePopover.ctorParameters = function () { return [
        { type: _angular_core.ElementRef, },
    ]; };
    MdePopover.propDecorators = {
        'positionX': [{ type: _angular_core.Input, args: ['mdePopoverPositionX',] },],
        'positionY': [{ type: _angular_core.Input, args: ['mdePopoverPositionY',] },],
        'triggerEvent': [{ type: _angular_core.Input, args: ['mdePopoverTriggerOn',] },],
        'enterDelay': [{ type: _angular_core.Input, args: ['mdePopoverEnterDelay',] },],
        'leaveDelay': [{ type: _angular_core.Input, args: ['mdePopoverLeaveDelay',] },],
        'overlapTrigger': [{ type: _angular_core.Input, args: ['mdePopoverOverlapTrigger',] },],
        'targetOffsetX': [{ type: _angular_core.Input, args: ['mdePopoverOffsetX',] },],
        'targetOffsetY': [{ type: _angular_core.Input, args: ['mdePopoverOffsetY',] },],
        'arrowOffsetX': [{ type: _angular_core.Input, args: ['mdePopoverArrowOffsetX',] },],
        'arrowWidth': [{ type: _angular_core.Input, args: ['mdePopoverArrowWidth',] },],
        'arrowColor': [{ type: _angular_core.Input, args: ['mdePopoverArrowColor',] },],
        'closeOnClick': [{ type: _angular_core.Input, args: ['mdePopoverCloseOnClick',] },],
        'focusTrapEnabled': [{ type: _angular_core.Input, args: ['mdeFocusTrapEnabled',] },],
        'classList': [{ type: _angular_core.Input, args: ['class',] },],
        'close': [{ type: _angular_core.Output },],
        'templateRef': [{ type: _angular_core.ViewChild, args: [_angular_core.TemplateRef,] },],
    };
    return MdePopover;
}());

/**
 * This directive is intended to be used in conjunction with an md-popover tag.  It is
 * responsible for toggling the display of the provided popover instance.
 */
var MdePopoverTrigger = (function () {
    /**
     * @param {?} _overlay
     * @param {?} _element
     * @param {?} _viewContainerRef
     * @param {?} _dir
     */
    function MdePopoverTrigger(_overlay, _element, _viewContainerRef, _dir) {
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
        this.onPopoverOpen = new _angular_core.EventEmitter();
        /**
         * Event emitted when the associated popover is closed.
         */
        this.onPopoverClose = new _angular_core.EventEmitter();
    }
    /**
     * @return {?}
     */
    MdePopoverTrigger.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._checkPopover();
        this._setCurrentConfig();
        this.popover.close.subscribe(function () { return _this.closePopover(); });
    };
    /**
     * @return {?}
     */
    MdePopoverTrigger.prototype.ngOnDestroy = function () { this.destroyPopover(); };
    /**
     * @return {?}
     */
    MdePopoverTrigger.prototype._setCurrentConfig = function () {
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
    };
    Object.defineProperty(MdePopoverTrigger.prototype, "popoverOpen", {
        /**
         * Whether the popover is open.
         * @return {?}
         */
        get: function () { return this._popoverOpen; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdePopoverTrigger.prototype.onClick = function () {
        if (this.popover.triggerEvent === 'click') {
            // this.popover.setCurrentStyles();
            // this._setCurrentConfig();
            this.togglePopover();
        }
    };
    /**
     * @return {?}
     */
    MdePopoverTrigger.prototype.onMouseOver = function () {
        var _this = this;
        if (this.popover.triggerEvent === 'hover') {
            this._mouseoverTimer = setTimeout(function () {
                _this.openPopover();
            }, this.popover.enterDelay);
        }
    };
    /**
     * @return {?}
     */
    MdePopoverTrigger.prototype.onMouseLeave = function () {
        var _this = this;
        if (this.popover.triggerEvent === 'hover') {
            if (this._mouseoverTimer) {
                clearTimeout(this._mouseoverTimer);
                this._mouseoverTimer = null;
            }
            if (this._popoverOpen) {
                setTimeout(function () {
                    if (!_this.popover.closeDisabled) {
                        _this.closePopover();
                    }
                }, this.popover.leaveDelay);
            }
        }
    };
    /**
     * Toggles the popover between the open and closed states.
     * @return {?}
     */
    MdePopoverTrigger.prototype.togglePopover = function () {
        return this._popoverOpen ? this.closePopover() : this.openPopover();
    };
    /**
     * Opens the popover.
     * @return {?}
     */
    MdePopoverTrigger.prototype.openPopover = function () {
        if (!this._popoverOpen) {
            this._createOverlay().attach(this._portal);
            /** Only subscribe to backdrop if trigger event is click */
            if (this.triggerEvent === 'click') {
                this._subscribeToBackdrop();
            }
            this._initPopover();
        }
    };
    /**
     * Closes the popover.
     * @return {?}
     */
    MdePopoverTrigger.prototype.closePopover = function () {
        if (this._overlayRef) {
            this._overlayRef.detach();
            /** Only unsubscribe to backdrop if trigger event is click */
            if (this.triggerEvent === 'click') {
                this._backdropSubscription.unsubscribe();
            }
            this._resetPopover();
        }
    };
    /**
     * Removes the popover from the DOM.
     * @return {?}
     */
    MdePopoverTrigger.prototype.destroyPopover = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
            this._cleanUpSubscriptions();
        }
    };
    /**
     * Focuses the popover trigger.
     * @return {?}
     */
    MdePopoverTrigger.prototype.focus = function () {
        this._element.nativeElement.focus();
    };
    Object.defineProperty(MdePopoverTrigger.prototype, "dir", {
        /**
         * The text direction of the containing app.
         * @return {?}
         */
        get: function () {
            return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method ensures that the popover closes when the overlay backdrop is clicked.
     * We do not use first() here because doing so would not catch clicks from within
     * the popover, and it would fail to unsubscribe properly. Instead, we unsubscribe
     * explicitly when the popover is closed or destroyed.
     * @return {?}
     */
    MdePopoverTrigger.prototype._subscribeToBackdrop = function () {
        var _this = this;
        if (this._overlayRef) {
            this._backdropSubscription = this._overlayRef.backdropClick().subscribe(function () {
                _this.popover._emitCloseEvent();
            });
        }
    };
    /**
     * This method sets the popover state to open and focuses the first item if
     * the popover was opened via the keyboard.
     * @return {?}
     */
    MdePopoverTrigger.prototype._initPopover = function () {
        this._setIsPopoverOpen(true);
    };
    /**
     * This method resets the popover when it's closed, most importantly restoring
     * focus to the popover trigger if the popover was opened via the keyboard.
     * @return {?}
     */
    MdePopoverTrigger.prototype._resetPopover = function () {
        this._setIsPopoverOpen(false);
        // Focus only needs to be reset to the host element if the popover was opened
        // by the keyboard and manually shifted to the first popover item.
        if (!this._openedByMouse) {
            this.focus();
        }
        this._openedByMouse = false;
    };
    /**
     * set state rather than toggle to support triggers sharing a popover
     * @param {?} isOpen
     * @return {?}
     */
    MdePopoverTrigger.prototype._setIsPopoverOpen = function (isOpen) {
        this._popoverOpen = isOpen;
        this._popoverOpen ? this.onPopoverOpen.emit() : this.onPopoverClose.emit();
    };
    /**
     *  This method checks that a valid instance of MdPopover has been passed into
     *  mdPopoverTriggerFor. If not, an exception is thrown.
     * @return {?}
     */
    MdePopoverTrigger.prototype._checkPopover = function () {
        if (!this.popover) {
            throwMdePopoverMissingError();
        }
    };
    /**
     *  This method creates the overlay from the provided popover's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openPopover is called.
     * @return {?}
     */
    MdePopoverTrigger.prototype._createOverlay = function () {
        if (!this._overlayRef) {
            this._portal = new _angular_cdk.TemplatePortal(this.popover.templateRef, this._viewContainerRef);
            var /** @type {?} */ config = this._getOverlayConfig();
            this._subscribeToPositions(/** @type {?} */ (config.positionStrategy));
            this._overlayRef = this._overlay.create(config);
        }
        return this._overlayRef;
    };
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @return {?} OverlayState
     */
    MdePopoverTrigger.prototype._getOverlayConfig = function () {
        var /** @type {?} */ overlayState = new _angular_material.OverlayState();
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
    };
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the popover based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     * @param {?} position
     * @return {?}
     */
    MdePopoverTrigger.prototype._subscribeToPositions = function (position) {
        var _this = this;
        this._positionSubscription = position.onPositionChange.subscribe(function (change) {
            var /** @type {?} */ posisionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
            var /** @type {?} */ posisionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
            if (!_this.popover.overlapTrigger) {
                posisionY = posisionY === 'below' ? 'above' : 'below';
            }
            _this.popover.positionX = posisionX;
            _this.popover.positionY = posisionY;
            _this.popover.setCurrentStyles();
            _this.popover.setPositionClasses(posisionX, posisionY);
        });
    };
    /**
     * This method builds the position strategy for the overlay, so the popover is properly connected
     * to the trigger.
     * @return {?} ConnectedPositionStrategy
     */
    MdePopoverTrigger.prototype._getPosition = function () {
        var _a = this.popover.positionX === 'before' ? ['end', 'start'] : ['start', 'end'], posX = _a[0], fallbackX = _a[1];
        var _b = this.popover.positionY === 'above' ? ['bottom', 'top'] : ['top', 'bottom'], overlayY = _b[0], fallbackOverlayY = _b[1];
        var /** @type {?} */ originY = overlayY;
        var /** @type {?} */ fallbackOriginY = fallbackOverlayY;
        /** Reverse overlayY and fallbackOverlayY when overlapTrigger is false */
        if (!this.popover.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            fallbackOriginY = fallbackOverlayY === 'top' ? 'bottom' : 'top';
        }
        var /** @type {?} */ offsetX = 0;
        var /** @type {?} */ offsetY = 0;
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
        var element = this._element;
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
    };
    /**
     * @return {?}
     */
    MdePopoverTrigger.prototype._cleanUpSubscriptions = function () {
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MdePopoverTrigger.prototype._handleMousedown = function (event) {
        if (!_angular_cdk.isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
        }
    };
    MdePopoverTrigger.decorators = [
        { type: _angular_core.Directive, args: [{
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
    MdePopoverTrigger.ctorParameters = function () { return [
        { type: _angular_material.Overlay, },
        { type: _angular_core.ElementRef, },
        { type: _angular_core.ViewContainerRef, },
        { type: _angular_material.Directionality, decorators: [{ type: _angular_core.Optional },] },
    ]; };
    MdePopoverTrigger.propDecorators = {
        'popover': [{ type: _angular_core.Input, args: ['mdePopoverTriggerFor',] },],
        'targetElement': [{ type: _angular_core.Input, args: ['mdePopoverTargetAt',] },],
        'positionX': [{ type: _angular_core.Input, args: ['mdePopoverPositionX',] },],
        'positionY': [{ type: _angular_core.Input, args: ['mdePopoverPositionY',] },],
        'triggerEvent': [{ type: _angular_core.Input, args: ['mdePopoverTriggerOn',] },],
        'enterDelay': [{ type: _angular_core.Input, args: ['mdePopoverEnterDelay',] },],
        'leaveDelay': [{ type: _angular_core.Input, args: ['mdePopoverLeaveDelay',] },],
        'overlapTrigger': [{ type: _angular_core.Input, args: ['mdePopoverOverlapTrigger',] },],
        'targetOffsetX': [{ type: _angular_core.Input, args: ['mdePopoverOffsetX',] },],
        'targetOffsetY': [{ type: _angular_core.Input, args: ['mdePopoverOffsetY',] },],
        'arrowOffsetX': [{ type: _angular_core.Input, args: ['mdePopoverArrowOffsetX',] },],
        'arrowWidth': [{ type: _angular_core.Input, args: ['mdePopoverArrowWidth',] },],
        'arrowColor': [{ type: _angular_core.Input, args: ['mdePopoverArrowColor',] },],
        'closeOnClick': [{ type: _angular_core.Input, args: ['mdePopoverCloseOnClick',] },],
        'onPopoverOpen': [{ type: _angular_core.Output },],
        'onPopoverClose': [{ type: _angular_core.Output },],
    };
    return MdePopoverTrigger;
}());

var MdePopoverModule = (function () {
    function MdePopoverModule() {
    }
    MdePopoverModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_material.OverlayModule,
                        _angular_common.CommonModule,
                        _angular_material.MdRippleModule,
                        _angular_material.MdCommonModule,
                        _angular_cdk.A11yModule
                    ],
                    exports: [MdePopover, MdePopoverTrigger, _angular_material.MdCommonModule],
                    declarations: [MdePopover, MdePopoverTrigger],
                },] },
    ];
    /**
     * @nocollapse
     */
    MdePopoverModule.ctorParameters = function () { return []; };
    return MdePopoverModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

exports.MdePopoverModule = MdePopoverModule;
exports.ɵa = MdePopover;
exports.ɵc = transformPopover;
exports.ɵb = MdePopoverTrigger;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mde.umd.js.map
