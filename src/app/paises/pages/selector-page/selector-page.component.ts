import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall } from '../../interfaces/paises-interface';
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  //llenado de selectores

  regiones: string[] = [];
  paises: PaisSmall[] = [];

  // fronteras: String[] = [];
  fronteras: PaisSmall[] = [];


  //UI
  cargando: boolean= false;


  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  constructor(private fb: FormBuilder,
    private paisesService: PaisesServiceService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region => {
    //     console.log(region)

    //     this.paisesService.getPaisesPorRegion(region)
    //       .subscribe(paises => {
    //         this.paises = paises;
    //         console.log(paises)
    //       })
    //   })

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.paises= [];
          this.cargando= true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando= false;
      }
      );


    //Cuando Cambia el Pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap((_) =>{
        this.miFormulario.get('frontera')?.reset('')
        this.fronteras = [];
        this.cargando= true;
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo)),
      switchMap(pais => this.paisesService.getPaisesPorCodigo(pais?.borders!))
    )
      .subscribe(paises => {
        console.log(paises)
        // this.fronteras = pais?.borders || [];
        console.log(paises)
        this.fronteras = paises;
        this.cargando= false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }

}
