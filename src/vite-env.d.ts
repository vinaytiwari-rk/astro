/// <reference types="vite/client" />

declare module 'tz-lookup' {
  function tzlookup(lat: number, lng: number): string;
  export = tzlookup;
}
