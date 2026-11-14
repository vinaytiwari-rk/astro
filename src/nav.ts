export type MainTab =
  | 'dossier'
  | 'home'
  | 'kundli'
  | 'predictions'
  | 'dasha_transits'
  | 'branches'
  | 'western'
  | 'matchmaking'
  | 'panchang_muhurta'
  | 'patrika_booklet'
  // Backward-compatibility aliases:
  | 'basics'
  | 'vargas'
  | 'dasha'
  | 'ashtakavarga'
  | 'strength'
  | 'transits'
  | 'tools'
  | 'astro_tools'
  | 'match'
  | 'hub'
  | 'prashna';

export interface RouteRequest {
  tab: MainTab;
  subTab?: string;
  nested?: string;
  nonce: number;
}
