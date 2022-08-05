import { Component, OnInit } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { IHotel } from "../shared/models/hotel";
import { HotelListService } from "../shared/services/hotel-list.service";


@Component({
      selector: 'app-hotel-list',
      templateUrl: './hotel-list.component.html',
      styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
      public title = 'Liste hotels';
      public hotels: IHotel[] = [];
      public hotels$: Observable<IHotel[]> = of([]);

      // public hotels: IHotel[] = [
      //   {
      //       "id": 1,
      //       "hotelName": "Buea sweet life",
      //       "description": "Belle vue au bord de la mer",
      //       "price": 230.5,
      //       "imageUrl": "assets/img/hotel-room.jpg",
      //       "rating": 3.5
      // },
      // {
      //       "id": 2,
      //       "hotelName": "Marakech",
      //       "description": "Profitez de la vue sur les montagnes",
      //       "price": 145.5,
      //       "imageUrl": "assets/img/the-interior.jpg",
      //       "rating": 5
      //   },
      //   {
      //       "id": 3,
      //       "hotelName": "Abudja new look palace",
      //       "description": "Séjour complet avec service de voitures",
      //       "price": 120.12,
      //       "imageUrl": "assets/img/indoors.jpg",
      //       "rating": 4
      //       },
      //   {
      //       "id": 4,
      //       "hotelName": "Cape town city",
      //       "description": "Magnifique cadre pour votre séjour",
      //       "price": 135.12,
      //       "imageUrl": "assets/img/window.jpg",
      //       "rating": 2.5
      //       }
      // ];

      public showBadge: boolean = true;
      private _hotelFilter = '';
      public filteredHotels: IHotel[] = [];
      public filteredHotels$: Observable<IHotel[]> = of([]);
      public receivedRating: string | undefined;
      public errMsg: string | undefined;

      constructor(private hotelListService: HotelListService) { }

      ngOnInit() {
            // console.log('Méthode OnInit() démarrée au chargement du component');            
            this.hotels$ = this.hotelListService.getHotels();
            this.filteredHotels$ = this.hotels$;

            this.hotelListService.getHotels().subscribe({
                  next: hotels => {
                        this.hotels = hotels;
                        this.filteredHotels = this.hotels;
                  },
                  error: err => this.errMsg = err
            });
            this._hotelFilter = '';
      }

      public toggleIsNewBadge(): void {
            this.showBadge = !this.showBadge;
      }

      public get hotelFilter(): string {
            return this._hotelFilter;
      }

      public set hotelFilter(filter: string) {
            this._hotelFilter = filter;

            if (this.hotelFilter) {
                  this.filteredHotels$ = this.hotels$.pipe(
                        map((hotels: IHotel[]) => this.filterHotels(filter, hotels))
                  )
            } else {
                  this.filteredHotels$ = this.hotels$;
            }
            // this.filteredHotels = this.hotelFilter ? this.filterHotels(this.hotelFilter) : this.hotels;
      }

      public receiveRatingClicked(message: string): void {
            this.receivedRating = message;
      }

      private filterHotels(criteria: string, hotels: IHotel[]): IHotel[] {
            criteria = criteria.toLocaleLowerCase();

            const res = this.hotels.filter(
                  (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) != -1
            );
            return res;
      }

}