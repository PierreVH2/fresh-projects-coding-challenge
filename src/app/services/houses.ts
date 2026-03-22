import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { StaticDecode, Type } from 'typebox';
import { Decode, Errors } from 'typebox/value';

const HousesListSchema = Type.Array(Type.String());
const HouseManifestSchema = Type.Object({
  id: Type.String(),
  address: Type.String(),
  coordinates: Type.Optional({
    lat: Type.Number(),
    lng: Type.Number(),
  }),
  basePath: Type.String(),
  floorPlan: Type.String(),
  rooms: Type.Record(Type.String(), Type.Object({
    vertices: Type.Array(Type.Tuple([Type.Number(), Type.Number()])),
    images: Type.Array(Type.String()),
  }))
});
type HouseManifest = StaticDecode<typeof HouseManifestSchema>;

@Injectable({
  providedIn: 'root',
})
export class HousesService {
  hoverRoomName = signal('');
  clickedRoomName = signal('');
  defaultRoom = signal('');

  readonly activeRoomName = computed(() =>
    this.clickedRoomName() || this.hoverRoomName() || this.defaultRoom()
  );

  private readonly _house = httpResource<HouseManifest|undefined>(() => '/houses/2428742422/manifest.json', {
    parse: (data) => Decode(HouseManifestSchema, data)
  });

  get house() {
    return this._house.value;
  }

  readonly activeRoom = computed(() => {
    const house = this.house();
    const roomName = this.activeRoomName();
    return house?.rooms[roomName];
  });
}
