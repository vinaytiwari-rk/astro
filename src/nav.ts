export type MainTab =
  | 'home'
  | 'basics'
  | 'predictions'
  | 'branches'
  | 'prashna'
  | 'vargas'
  | 'dasha'
  | 'ashtakavarga'
  | 'strength'
  | 'transits'
  | 'tools'
  | 'astro_tools'
  | 'match';

export interface RouteRequest {
  tab: MainTab;
  subTab?: string;
  nested?: string;
  nonce: number;
}
