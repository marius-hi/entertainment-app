import { Injectable } from '@angular/core';
import { MediaType, TMDB_IMAGE_PATH } from '../../app.settings';
import { IMediaResponseItemDetails } from './media-data.service';

interface IMediaItemDetails {
  description:string;
}

export interface IMediaItem extends IMediaItemDetails {
  id:number;
  title?:string;
  subtitle?:Date;
  rating:number;
  image:string;
  urlPageDetail:string;
  genres?:{
    id:number;
    name:string;
  }[];
  votes?:number;
  episodes?:number;
  seasons?:number;
  language?:string;
  popularity?:number;
  length?:number
}

@Injectable()
export class MediaService {
  public parseMediaData(mediaItems:any[], mediaType:MediaType):IMediaItem[] {
    const parseFn:Function = this.getParseFn(mediaType);
    const items:IMediaItem[] = [];
    mediaItems
      .forEach((mediaItem:IMediaResponseItemDetails) => {
        items.push(parseFn(mediaItem));
      });
    return items;
  }

  private parseMovieItem(movieData:IMediaResponseItemDetails):IMediaItem {
    return {
      id: movieData.id,
      title: movieData.title,
      subtitle: movieData.release_date,
      rating: movieData.vote_average,
      image: `${TMDB_IMAGE_PATH}/${movieData.poster_path}`,
      urlPageDetail: `/movie/detail/${movieData.id}`,
      //
      description: movieData.overview,
      length: movieData.runtime,
      genres: movieData.genres,
      language: movieData.original_language,
      popularity: movieData.popularity,
      votes: movieData.vote_count
    };
  }

  private parseTVShowItem(tvShowData:IMediaResponseItemDetails):IMediaItem {
    return {
      id: tvShowData.id,
      title: tvShowData.name,
      subtitle: tvShowData.first_air_date,
      rating: tvShowData.vote_average,
      image: `${TMDB_IMAGE_PATH}/${tvShowData.poster_path}`,
      urlPageDetail: `/tv-show/detail/${tvShowData.id}`,
      // --
      description: tvShowData.overview,
      length: tvShowData.runtime,
      genres: tvShowData.genres,
      episodes: tvShowData.number_of_episodes,
      seasons: tvShowData.number_of_seasons,
      language: tvShowData.original_language,
      popularity: tvShowData.popularity,
      votes: tvShowData.vote_count,
    };
  }

  private getParseFn(mediaType:MediaType):Function {
    let parseFn:Function;
    switch (mediaType){
      case MediaType.MOVIE:
        parseFn = this.parseMovieItem;
        break;
      case MediaType.TV_SHOW:
        parseFn = this.parseTVShowItem;
        break;
    }
    return parseFn;
  }
}
