import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TMDB_API_HOST } from '../../app.config';
import { Cacheable } from 'ts-cacheable';
import { MediaType } from '../../app.routes';

export interface IMediaDataResponse {
  page:number;
  results:IMovieItem[]|ITVShowItem[];
  total_pages:number;
  total_results:number;
}

interface IMediaDataItem {
  id:number;
  adult:boolean;
  backdrop_path:string;
  genre_ids:number[];
  original_language:string;
  overview:string;
  popularity:number;
  poster_path:string;
  video:boolean;
  vote_average:number;
  vote_count:number;
}

export interface IMovieItem extends IMediaDataItem {
  title:string;
  original_title:string;
  release_date:Date;
}

export interface ITVShowItem extends IMediaDataItem {
  name:string;
  origin_country:string;
  original_name:string;
  first_air_date:Date;
}

export interface IMediaDetailsResponse extends IMediaDataItem {
  belongs_to_collection: {
    backdrop_path:string;
    id:number;
    name:string;
    poster_path:string;
  };
  budget:number;
  genres: {
    id:number;
    name:string;
  }[];
  homepage:string;
  imdb_id:string;
  production_companies: {
    id:number;
    logo_path:string;
  };
  revenue:number;
  runtime:number;
  spoken_languages: {
    iso_639_1:string;
    name:string;
  }[];
  status:string;
  tagline:string;
  videos: {
    id:string;
  }
}

@Injectable()
export class MediaDataService {
  constructor(
    private http:HttpClient
  ) {}

  @Cacheable()
  public getTopRated(mediaType:MediaType, page?:number): Observable<IMediaDataResponse> {
    let url:string = `${TMDB_API_HOST}/${mediaType}/top_rated?language=en-US`;
    if(page){
      url += `&page=${page}`;
    }
    return this.http.get<IMediaDataResponse>(url);
  }

  @Cacheable()
  public getDetails(mediaType:MediaType, id:number): Observable<IMediaDetailsResponse> {
    let url:string = `${TMDB_API_HOST}/${mediaType}/${id}`;
    return this.http.get<IMediaDetailsResponse>(url);
  }
}
