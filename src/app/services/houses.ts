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
  houseList = httpResource<string[]>(() => '/house-list.json', {
    parse: (data) => Decode(HousesListSchema, data)
  });

  readonly houseManifests = computed(() =>
    (this.houseList.value() ?? []).reduce<Record<string,HttpResourceRef<HouseManifest | undefined>>>((accum, url) => ({
      ...accum,
      [url]: httpResource(() => url, {
        parse: (data) => Decode(HouseManifestSchema, data)
      })
    }), {})
  );

  hoverRoomName = signal('');
  clickedRoomName = signal('');

  private readonly _cycleIndex = signal(0);
  readonly cycleRoomName = computed(() => {
    const rooms = this.house()?.rooms;
    if (!rooms) return '';
    const keys = Object.keys(rooms);
    return keys[this._cycleIndex() % keys.length] ?? '';
  });

  readonly activeRoomName = computed(() =>
    this.clickedRoomName() || this.hoverRoomName() || this.cycleRoomName()
  );

  constructor() {
    effect((onCleanup) => {
      // restart interval whenever house rooms change
      this.house();
      const id = setInterval(() => this._cycleIndex.update((i) => i + 1), 3000);
      onCleanup(() => clearInterval(id));
    });
  }

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

  public getHouseManifest = (url: string): Signal<HouseManifest | undefined> => {
    // Inside this function, a new computed signal is created and returned
    return computed(() => this.houseManifests()[url]?.value());
  };
}
