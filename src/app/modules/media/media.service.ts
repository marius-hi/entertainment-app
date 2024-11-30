import { Injectable } from '@angular/core';
import { DEFAULT_COVER, MediaType, TMDB_IMAGE_PATH } from '../../app.settings';
import { IMediaResponseItem, IMediaResponseItemDetails } from './media-data.service';

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

type MediaResponse = IMediaResponseItemDetails & IMediaResponseItem;

@Injectable()
export class MediaService {
  public parseMediaData(mediaItems:IMediaResponseItemDetails[]|IMediaResponseItem[], mediaType:MediaType):IMediaItem[] {
    const items:IMediaItem[] = [];
    mediaItems
      .forEach((mediaItem:MediaResponse) => {
        items.push(this.getParseFn(mediaItem, mediaType));
      });
    return items;
  }

  private parseMovieItem(movieData:MediaResponse):IMediaItem {
    return {
      id: movieData.id,
      title: movieData.title,
      subtitle: movieData.release_date,
      rating: movieData.vote_average,
      image: movieData.poster_path ? `${TMDB_IMAGE_PATH}/${movieData.poster_path}` : DEFAULT_COVER,
      urlPageDetail: `/movie/detail/${movieData.id}`,
      // --
      description: movieData.overview,
      length: movieData.runtime,
      genres: movieData.genres,
      language: movieData.original_language,
      popularity: movieData.popularity,
      votes: movieData.vote_count
    };
  }

  private parseTVShowItem(tvShowData:MediaResponse):IMediaItem {
    return {
      id: tvShowData.id,
      title: tvShowData.name,
      subtitle: tvShowData.first_air_date,
      rating: tvShowData.vote_average,
      image: tvShowData.poster_path ? `${TMDB_IMAGE_PATH}/${tvShowData.poster_path}` : DEFAULT_COVER,
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

  private getParseFn(mediaItem:MediaResponse, mediaType:MediaType):IMediaItem {
    switch (mediaType){
      case MediaType.MOVIE:
        return this.parseMovieItem(mediaItem);
      case MediaType.TV_SHOW:
        return this.parseTVShowItem(mediaItem);
    }
  }
}
