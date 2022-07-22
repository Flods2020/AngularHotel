import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';
import { GlobalGenericValidator } from '../shared/validators/global-generic.validator';

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.css'],
})
export class HotelEditComponent implements OnInit, AfterViewInit {
  public hotelForm: FormGroup | any;

  public hotel: IHotel | undefined;

  public pageTitle: string | undefined;

  public errorMessage: string | undefined;

  public formErrors: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } } = {
    hotelName: {
      required: 'Le nom de l\'hôtel est obligatoire'
    },
    price: {
      required: 'Le prix de l\'hôtel est obligatoire'
    }
  }

  private globalGenericValidator: GlobalGenericValidator | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelListService
  ) { }

  ngOnInit(): void {
    this.globalGenericValidator = new GlobalGenericValidator(this.validationMessages);
    this.hotelForm = this.fb.group({
      hotelName: ['', Validators.required],
      price: ['', Validators.required],
      rating: [''],
      description: [''],
      tags: this.fb.array([]),
    });

    this.route.paramMap.subscribe((params) => {
      const id: number | any = params.get('id');
      console.log(id);

      this.getSelectedHotel(id);
    });
  }

  ngAfterViewInit(): void {
    if (this.globalGenericValidator) {
      this.formErrors = this.globalGenericValidator.createErrorMessage(this.hotelForm);
    }
  }

  public hideError(): void {
    this.errorMessage = undefined;
  }

  public get tags(): FormArray {
    return this.hotelForm.get('tags') as FormArray;
  }

  public addTags(): void {
    this.tags.push(new FormControl())
  }

  public deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  public getSelectedHotel(id: number): void {
    this.hotelService.getHotelById(id).subscribe((hotel: IHotel) => {
      console.log('getSelectedHotel(): ', this.hotel);
      this.displayHotel(hotel);
    });
  }

  public displayHotel(hotel: IHotel): void {
    this.hotel = hotel;
    console.log('displayHotel(): ', hotel);

    // if(this.hotel.hotelId == 0) {
    //   this.pageTitle = 'Créer un hotel';
    // } else {
    //   this.pageTitle = `Modifier l\'hotel ${hotel.hotelName}`;
    // }
    //  OU
    this.pageTitle =
      this.hotel.id == 0
        ? 'Créer un hotel'
        : `Modifier hotel ${hotel.hotelName}`;

    this.hotelForm.patchValue({
      hotelName: this.hotel.hotelName,
      price: this.hotel.price,
      rating: this.hotel.rating,
      description: this.hotel.description,
    });
    this.hotelForm.setControl('tags', this.fb.array(this.hotel.tags || []));
    //passer la valeur d'un array à un formulaire
  }

  public saveHotel(): void {
    console.log('hotel Name: ', this.hotelForm.value.hotelName);

    if (this.hotelForm.valid) {
      if (this.hotelForm.dirty) {
        const hotel: IHotel = {
          ...this.hotel,
          ...this.hotelForm.value,
        };

        if (hotel.id == 0) {
          this.hotelService.createHotel(hotel).subscribe({
            next: () => this.saveCompleted(),
            error: (err) => this.errorMessage = err
          });
        } else {
          this.hotelService.updateHotel(hotel).subscribe({
            next: () => this.saveCompleted(),
            error: (err) => this.errorMessage = err
          });
        }
        console.log('saveHotel(): ', this.hotelForm.value);
      }
    }
  }

  public deleteHotel(): void {
    if (!!this.hotel) {
      if (confirm(`Voulez vous vraiment supprimer ${this.hotel.hotelName} ?`)) {
        this.hotelService.deleteHotel(this.hotel.id).subscribe({
          next: () => this.saveCompleted(),
        });
      }
    }
  }

  public saveCompleted(): void {
    this.hotelForm.reset();
    this.router.navigate(['/hotels/list']);
  }
}
