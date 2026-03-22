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