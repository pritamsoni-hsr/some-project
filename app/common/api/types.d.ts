import './openapi/runtime';

declare global {
  interface RequestInit {
    triedRefreshingToken?: boolean;
  }
}
