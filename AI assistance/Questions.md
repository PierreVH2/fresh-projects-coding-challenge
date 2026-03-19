Create an Angular component that accepts as input an image along with a map of polygonal regions expressed as Record<string,[number,number]> - these represent the floor plan for a building and the regions corresponding to rooms. The component should emit a signal when a room is clicked.

In src/app/services/houses on line 28 make houseManifests the full list of manifests from house-list.json

Same file line 31 fix incorrect generic type specifier