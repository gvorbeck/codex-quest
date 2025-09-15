# Tooltip Utils Functions Reference

This file documents all functions in `tooltipUtils.ts` with simple explanations and return values.

## **getResponsivePadding**
- **What it does**: Gives more padding on mobile devices than desktop
- **Returns**: A number (16 for mobile, 8 for desktop)

## **calculateArrowOffset**
- **What it does**: Figures out where to position the tooltip arrow to point at the trigger element
- **Returns**: A number (how far to offset the arrow from center)

## **shouldPositionBelow**
- **What it does**: Decides if the tooltip should show below or above the element that triggered it
- **Returns**: true (show below) or false (show above)

## **calculateVerticalPosition**
- **What it does**: Calculates the exact top position for the tooltip
- **Returns**: A number (pixels from top of screen)

## **calculateHorizontalPosition**
- **What it does**: Calculates the exact left position for the tooltip, keeping it on screen
- **Returns**: A number (pixels from left of screen)

## **calculateTooltipPosition**
- **What it does**: Main function that figures out where to put a tooltip on screen
- **Returns**: An object with position coordinates, arrow offset, and whether it's below or above

## **createTooltipPositioner**
- **What it does**: Creates a reusable function with preset positioning options
- **Returns**: A function that can calculate tooltip positions

## Potential Consolidation Opportunities
- Many calculation functions that could be simplified
- Complex positioning logic that might be over-engineered for the use case
- Consider if simpler tooltip positioning would work just as well