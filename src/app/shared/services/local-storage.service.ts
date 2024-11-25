import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  /**
   * @method set
   * @description Saves an item to the local storage
   * @param {string} key The key of the item
   * @param {string} value The value of the item
   */
  public set(key:string, value:string):void {
    localStorage.setItem(key, value);
  }

  /**
   * @method get
   * @description Fetches an item from the local storage
   * @param {string} key The key of the item
   * @return {string} The stored value of the item
   */
  public get(key:string):string | null {
    return localStorage.getItem(key);
  }

  /**
   * @method remove
   * @description Remove an item from the local storage
   * @param {string} key The key of the item
   */
  public remove(key:string):void {
    localStorage.removeItem(key);
  }

  /**
   * @method clear
   * @description Remove all items from the local storage
   */
  public clear():void {
    localStorage.clear();
  }
}
