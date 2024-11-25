import { Injectable } from '@angular/core';

import { IMovieItem, ITVShowItem } from '../media-data.service';
import { MediaType } from '../../../app.routes';
import { TMDB_IMAGE_PATH } from '../../../app.config';

export interface IMediaItem {
  id:number;
  title:string;
  subtitle:string;
  rating:number;
  image:string;
}

@Injectable()
export class MediaItemService {
  constructor() {}

  public parseMediaData(mediaData:IMovieItem|ITVShowItem, mediaType:MediaType):any {
    switch (mediaType){
      case MediaType.MOVIE:
        const movieData:IMovieItem = (<IMovieItem>mediaData);
        return {
          id: movieData.id,
          title: movieData.title,
          subtitle: movieData.release_date,
          rating: movieData.vote_average,
          image: `${TMDB_IMAGE_PATH}/${movieData.poster_path}`
        };

      case MediaType.TV_SHOW:
        const tvData:ITVShowItem = <ITVShowItem>mediaData;
        return {
          id: tvData.id,
          title: tvData.name,
          subtitle: tvData.first_air_date,
          rating: tvData.vote_average,
          image: `${TMDB_IMAGE_PATH}/${tvData.poster_path}`
        };
    }
  }
}
