

## Plan: Adjust Explore Icon Size in Bottom Tab Bar

**File**: `src/components/whacka/BottomTabBar.tsx`

**Change**: In the `TabButton` component rendering logic, increase the Compass/CompassFilled icon size from 18px to 20px while keeping Home at 18px. This compensates for the circular compass shape appearing visually smaller than the house shape at the same pixel size.

**Implementation**:
- Add a `size` prop to `TabButton` (or pass it conditionally)
- Set Home icon to 18px, Explore icon to 20px
- Apply the same size difference to both filled and outline states

