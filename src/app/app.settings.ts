// custom settings for the application

export const APP_NAME:string = 'Entertainment App';
export const TMDB_API_HOST:string = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_PATH:string = 'https://image.tmdb.org/t/p/w220_and_h330_face';
export const GRID_COLUMNS:number = 4; // how many columns to display in the grid (supported: 2, 3, 4 or 6)

export enum MediaType {
  MOVIE = 'movie',
  TV_SHOW = 'tv'
}
