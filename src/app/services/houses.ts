import { Injectable, Signal, computed, signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { StaticDecode, Type } from 'typebox';
import { Decode, Errors } from 'typebox/value';
import { toObservable } from '@angular/core/rxjs-interop';

const HousesListSchema = Type.Array(Type.String());
const HouseManifestSchema = Type.Object({
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

  houseManifests = computed(() =>
    (this.houseList.value() ?? []).reduce<Record<string,HttpResourceRef<HouseManifest | undefined>>>((accum, url) => ({
      ...accum,
      [url]: httpResource(() => url, {
        parse: (data) => Decode(HouseManifestSchema, data)
      })
    }), {})
  );

  // house = computed(() => this.houseManifests()[this.houseList.value()?.[0] ?? '']);
  house = httpResource<HouseManifest|undefined>(() => '/houses/2428742422/manifest.json', {
    parse: (data) => Decode(HouseManifestSchema, data)
  });

  public getHouseManifest = (url: string): Signal<HouseManifest | undefined> => {
    // Inside this function, a new computed signal is created and returned
    return computed(() => this.houseManifests()[url]?.value());
  };
}
