import { Component, OnInit } from "@angular/core";
import { catchError, combineLatest, EMPTY, filter, forkJoin, map, Observable, of, range, take, tap, throwError, withLatestFrom } from "rxjs";
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

            const a$ = of(1, 2, 3);
            const b$ = of(11, 12, 13);
            const c$ = of(21, 22, 23);

            combineLatest([a$, b$, c$]).subscribe((val) => console.log('combineLatest()', val));
            forkJoin([a$, b$, c$]).subscribe((val) => console.log('forkJoin()', val));

            a$.pipe(
                  withLatestFrom(b$, c$)
            ).subscribe((val) => console.log('withLatestFrom() ', val));

            /*TEST MANIP
            const oneTen = ["1", "2", "3", "4", "5", "6"];
            const oneTenNew: number[] = [];
            for (const val of oneTen) {
                  const valInt = parseInt(val);
                  console.log(val);
                  oneTenNew.push(valInt);
            }
            of(oneTenNew).pipe(
                  map((vals: number[]) => vals.map((v: number) => v + 4))
            ).subscribe(v => console.log("one Ten New ", v))*/


            // console.log('Méthode OnInit() démarrée au chargement du component');            
            this.hotels$ = this.hotelListService.getHotels().pipe(
                  catchError((err) => {
                        this.errMsg = err
                        // return of([]);
                        // return throwError(err);
                        return EMPTY; // renvoie un Observable<never> donc vide
                  })
            );
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