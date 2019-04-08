import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ɵlooseIdentical as looseIdentical
} from "@angular/core";

@Directive({
  selector: '[contenteditableModel]',
  host: {
    '(blur)': 'onBlur()'
  }
})
export class ContenteditableModel implements OnChanges {
  @Input('contenteditableModel') model: any;
  @Output('contenteditableModelChange') update = new EventEmitter();

  private lastViewModel: any;


  constructor(private elRef: ElementRef) {
  }

  ngOnChanges(changes) {
    if (isPropertyUpdated(changes, this.lastViewModel)) {
      this.lastViewModel = this.model
      this.refreshView()
    }
  }

  onBlur() {
    var value = this.elRef.nativeElement.innerText
    this.lastViewModel = value
    this.update.emit(value)
  }

  private refreshView() {
    this.elRef.nativeElement.innerText = this.model
  }
}

export function isPropertyUpdated(changes, viewModel) {
  if (!changes.hasOwnProperty('model'))
    return false;
  /** @type {?} */
  const change = changes['model'];
  if (change.isFirstChange())
    return true;
  return !looseIdentical(viewModel, change.currentValue);
}
