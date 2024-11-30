import { Injectable } from '@angular/core';

const DEFAULT_ERROR_MESSAGE = 'An error occurred';

export enum ErrorPrefix {
  LOADING_DATA = 'Error loading data',
  SEARCHING_DATA = 'Error searching data'
}

interface IHttpError {
  success:boolean;
  status_code:number;
  status_message:string;
}

type IErrorMessage = IHttpError;

@Injectable()
export class MessageService {
  public formatError = (err:ErrorEvent, addPrefix?:ErrorPrefix):string => {
    let formattedError = `<h4>${addPrefix || DEFAULT_ERROR_MESSAGE}</h4>`;
    const error:IErrorMessage = err?.error;


    if(error.status_message) {
      formattedError += 'Please report the error below to the owner of the application <hr />';

      if(error.status_message && error.status_code){
        formattedError += `<small>${error.status_message} (code: ${error.status_code})</small>`;
      }

      if(err.message){
        formattedError += `<p><small>${err.message}</small></p>`;
      }
    }

    return formattedError;
  };
}
