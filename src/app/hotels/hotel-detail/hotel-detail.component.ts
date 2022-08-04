import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {

  public hotel: IHotel | undefined = <IHotel>{};

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id: number | any = this.route.snapshot.paramMap.get('id');

    this.hotelService.getHotels()
      .pipe(
        map((hotels: IHotel[]) => hotels.find(hotel => hotel.id == id))
      )
      .subscribe((hotel: IHotel | undefined) => {
        this.hotel = hotel;
        // console.log('hotel: ', this.hotel);
      });

    // console.log(id);
  }

  public backToList(): void {
    this.router.navigate(['/hotels']);
  }

}
