export type MainTab =
  | 'workstation'
  | 'kundli'
  | 'matchmaking'
  | 'panchang_muhurta'
  | 'dasha_transits'
  | 'predictions'
  | 'branches'
  | 'western'
  | 'home'
  | 'patrika_booklet'
  | 'dossier'
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
