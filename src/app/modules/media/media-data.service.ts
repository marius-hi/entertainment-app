import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaType, TMDB_API_HOST } from '../../app.settings';
import { Cacheable } from 'ts-cacheable';

export interface IMediaResponseData {
  page:number;
  results:IMediaResponseItem[];
  total_pages:number;
  total_results:number;
}

export interface IMediaResponseItem {
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
  title?:string;
  original_title?:string;
  release_date?:Date;
  name:string;
  origin_country:string;
  original_name:string;
  first_air_date:Date;
}

export interface IMediaResponseItemDetails extends IMediaResponseItem {
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
  number_of_episodes?:number;
  number_of_seasons?:number;
}

@Injectable()
export class MediaDataService {
  constructor(
    private http:HttpClient
  ) {}

  @Cacheable()
  public getTopRated(mediaType:MediaType, page?:number): Observable<IMediaResponseData> {
    let url:string = `${TMDB_API_HOST}/${mediaType}/top_rated?language=en-US`;
    if(page){
      url += `&page=${page}`;
    }
    return this.http.get<IMediaResponseData>(url);
  }

  @Cacheable()
  public getDetails(mediaType:MediaType, id:number): Observable<IMediaResponseItemDetails> {
    let url:string = `${TMDB_API_HOST}/${mediaType}/${id}`;
    return this.http.get<IMediaResponseItemDetails>(url);
  }
}
