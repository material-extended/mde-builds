import { EventEmitter, OnDestroy, TemplateRef, ElementRef } from '@angular/core';
import { MdePopoverPositionX, MdePopoverPositionY, MdePopoverTriggerEvent } from './popover-types';
import { MdePopoverPanel } from './popover-interfaces';
import { AnimationEvent } from '@angular/animations';
export declare class MdePopover implements MdePopoverPanel, OnDestroy {
    private _elementRef;
    /** Settings for popover, view setters and getters for more detail */
    private _positionX;
    private _positionY;
    private _triggerEvent;
    private _enterDelay;
    private _leaveDelay;
    private _overlapTrigger;
    private _targetOffsetX;
    private _targetOffsetY;
    private _arrowOffsetX;
    private _arrowWidth;
    private _arrowColor;
    private _closeOnClick;
    private _focusTrapEnabled;
    /** Config object to be passed into the popover's ngClass */
    private _classList;
    /** */
    containerPositioning: boolean;
    /** Closing disabled on popover */
    closeDisabled: boolean;
    /** Config object to be passed into the popover's arrow ngStyle */
    popoverPanelStyles: {};
    /** Config object to be passed into the popover's arrow ngStyle */
    popoverArrowStyles: {};
    /** Config object to be passed into the popover's content ngStyle */
    popoverContentStyles: {};
    /** Emits the current animation state whenever it changes. */
    _onAnimationStateChange: EventEmitter<AnimationEvent>;
    /** Position of the popover in the X axis. */
    positionX: MdePopoverPositionX;
    /** Position of the popover in the Y axis. */
    positionY: MdePopoverPositionY;
    /** Popover trigger event */
    triggerEvent: MdePopoverTriggerEvent;
    /** Popover enter delay */
    enterDelay: number;
    /** Popover leave delay */
    leaveDelay: number;
    /** Popover overlap trigger */
    overlapTrigger: boolean;
    /** Popover target offset x */
    targetOffsetX: number;
    /** Popover target offset y */
    targetOffsetY: number;
    /** Popover arrow offset x */
    arrowOffsetX: number;
    /** Popover arrow width */
    arrowWidth: number;
    /** Popover arrow color */
    arrowColor: string;
    /**
     * Popover container close on click
     * default: true
     */
    closeOnClick: boolean;
    /**
     * Popover focus trap using cdkTrapFocus
     * default: true
     */
    focusTrapEnabled: boolean;
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @param classes list of class names
     */
    classList: string;
    /** Event emitted when the popover is closed. */
    close: EventEmitter<void>;
    templateRef: TemplateRef<any>;
    constructor(_elementRef: ElementRef);
    ngOnDestroy(): void;
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the popover.
     */
    _emitCloseEvent(): void;
    /** Close popover on click if closeOnClick is true */
    onClick(): void;
    /**
     * TODO: Refactor when @angular/cdk includes feature I mentioned on github see link below.
     * https://github.com/angular/material2/pull/5493#issuecomment-313085323
     */
    /** Disables close of popover when leaving trigger element and mouse over the popover */
    onMouseOver(): void;
    /** Enables close of popover when mouse leaving popover element */
    onMouseLeave(): void;
    /** Sets the current styles for the popover to allow for dynamically changing settings */
    setCurrentStyles(): void;
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(posX?: MdePopoverPositionX, posY?: MdePopoverPositionY): void;
}
