import { Injectable } from '@angular/core';
import { IMovieItem, ITVShowItem } from './media-data.service';
import { MediaType, TMDB_IMAGE_PATH } from '../../app.settings';

export interface IMediaItem {
  id:number;
  title:string;
  subtitle:Date;
  rating:number;
  image:string;
}

@Injectable()
export class MediaService {

  public parseMediaData(mediaItems:IMovieItem[]|ITVShowItem[], mediaType:MediaType):IMediaItem[] {
    const items:IMediaItem[] = [];
    mediaItems.forEach((mediaItem:IMovieItem|ITVShowItem) => {
      switch (mediaType){
        case MediaType.MOVIE:
          items.push(this.parseMovieItem(<IMovieItem>mediaItem));
          break;
        case MediaType.TV_SHOW:
          items.push(this.parseTVShowItem(<ITVShowItem>mediaItem));
          break;
      }
    });

    return items;
  }

  private parseMovieItem(movieData:IMovieItem):IMediaItem {
    return {
      id: movieData.id,
      title: movieData.title,
      subtitle: movieData.release_date,
      rating: movieData.vote_average,
      image: `${TMDB_IMAGE_PATH}/${movieData.poster_path}`
    };
  }

  private parseTVShowItem(tvShowData:ITVShowItem):IMediaItem {
    return {
      id: tvShowData.id,
      title: tvShowData.name,
      subtitle: tvShowData.first_air_date,
      rating: tvShowData.vote_average,
      image: `${TMDB_IMAGE_PATH}/${tvShowData.poster_path}`
    };
  }
}
