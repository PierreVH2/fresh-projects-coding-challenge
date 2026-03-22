Create an Angular component that accepts as input an image along with a map of polygonal regions expressed as Record<string,[number,number]> - these represent the floor plan for a building and the regions corresponding to rooms. The component should emit a signal when a room is clicked.

In src/app/services/houses on line 28 make houseManifests the full list of manifests from house-list.json

Same file line 31 fix incorrect generic type specifier

In public/houses/**/manifest.json change the vertex coordinates to be fractions of the image sizes

Now change the floor-plan component in src/app/components to use the fractional vertex coordinates correctly and to scale according to the on-screen size of the image.

Implement src/app/services/responsive.ts - add signals for the screen width and height as well a signal that emits "mobile", "tablet" or "desktop" depending on the larger of the width and height dimensions as well as an orientation signal that emits either "portrait" or "landscape"

Next modify the App component to align its child components side-by-side if the aspectRatio signal in the Response service is greater than 4:3 and otherwise aligns them one on top of the other.

Modify App component and its children such that in side-by-side/horizontal layout the floor-plan component scales up to a maximum of the device height and 50% of the width and frees the remaining width to be used by the image-gallery component and correspondingly for the vertical layout. Ensure floor-plan and image-gallery are centered in the non-limiting dimension.

Fix the styling of floor-plan - in some screen sizes the image overflows the container.

Modify image-gallery image sizes such that the images scale down proportionately when necessary

I'm trying to make the image-gallery component render its images as a single column in landscape mobile and other landscape modes as a double column; all lanscape gallery should scroll vertically if overflow. In portrait gallery should scroll horizontally in mobile as a single row and other sizes as a double row.

Modify floor-plan component such that it shows the name of each room in the middle of each room.

Great! Now make the text rotated by 90 deg in each room that's narrower than it is tall.

Currently the rooms in floor-plan are highlighted when the user hovers over them, but I'm not sure where this comes from. This highlight should be very mild and grey. Also add a more pronounced blue highlight that tracks the activeRoom signal on HouseService.

In HouseService add another signal that cycles through the available rooms every 3 seconds and change activeRoomName such that it first selects the clicked room, then the hovered room, then the cycle room.

modify image-gallery such that it gets its orientation parameter ('vertical' / 'horizontal') as an input from App rather than reading it from HouseService. Also remove the dependency on HouseService.breakpoint by making it render 2 columns if in vertical orientation and the width is less than 768 px and similarly for rows in horizontal

I made some changes to better align with what I want but now I'm getting an error "Cannot read properties of undefined (reading 'nativeElement')" on line 32 of image-gallery.ts

[CANCELLED BEFORE COMPLETION] Add "auto scroll" functionality to the image-gallery component that scrolls the track from start to finish over a few seconds (whatever implementation approach is easiest). It must be activated using an optional input parameter that defaults to false. The scrolling should pause if the user hovers over the image-gallery component.

Additional requirement: the image-gallery component should emit a signal when auto-scroll is active and the end of the track is reached.

I'm occasionally getting an error in Angular "image-gallery.html:2 NG0956: The configured tracking expression (track by identity) caused re-creation of the entire collection of size 1. This is an expensive operation requiring destruction and subsequent creation of DOM nodes, directives, components etc. Please review the "track expression" and make sure that it uniquely identifies items in a collection"

Modifty auto-scroll such that if there is not enough content to scroll, then the scrollEnd event should emit when a length of time has passed equivalent to the width of the component considering autoScrollPxPerFrame

In App component add a check box for activating autoscrolling to the image-gallery-container div and fix the layout. The image-gallery-heading component should be top-left, the check box top-right aligning side-by-side if there is enough space and check box below the heading if the view is too narrow, followed by the image-gallery component occupying max height.

The autoscroll seems to be broken

Undo the changes from portrait -> horizontal and vertical -> landscaope - they were correct (they refer to the preferred scroll direction)

Make the global font Robot/Sans serif and make this themable