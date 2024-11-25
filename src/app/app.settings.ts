// custom settings for the application
export enum MediaType {
  MOVIE = 'movie',
  TV_SHOW = 'tv'
}
export const APP_NAME:string = 'Entertainment App'; // name of the application
export const FIRST_PAGE:string = '/tv-show/top-rated';  // the first page to start
export const TMDB_API_HOST:string = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_PATH:string = 'https://image.tmdb.org/t/p/w220_and_h330_face';
export const GRID_COLUMNS:number = 4; // how many columns to display in the grid (supported: 2, 3, 4 or 6)
export const SEARCH_DEBOUNCE_TIME:number = 1000; // milliseconds to wait after the user stops typing search input
export const SEARCH_START_MIN_CHARACTERS:number = 3; // minimum number of characters before performing a search
export const SCROLL_THROTTLE:number = 500; // milliseconds to wait after the user stops scrolling
export const SCROLL_DISTANCE:number = 1; // the bottom percentage point of the scroll nob relatively to the infinite-scroll container (https://github.com/orizens/ngx-infinite-scroll)
