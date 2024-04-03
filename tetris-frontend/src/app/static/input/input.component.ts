import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Requirements } from '../interfaces/requirements.interface';
import { InputChangesDto } from './input.event.interface';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
    ngOnInit(): void {
        this.inputType = this.isPassword ? 'password' : 'text';
        this.requirements = {
            required: true,
            minLength: 4,
            maxLength: null,
            isEmail: false,
            ...this.requirements,
        };
    }

    /**
     * The current value of the input.
     */
    value: string = '';

    /**
     * This value will be sued to display errors to the user.
     */
    @Input()
    UiName: string = '';

    @Input()
    submitAttempt: boolean = false;
    /**
     * Whether it is a password or not.
     */
    @Input()
    isPassword: boolean = false;

    /**
     * The string value that will be used as the key in the event emitter object.
     */
    @Input()
    name: string = '';

    /**
     * PLaceholder.
     */
    @Input()
    placeHolder: string = '';

    /**
     * Requirements that will be used for errors.
     */
    @Input()
    requirements!: Requirements;

    @Input()
    isMatchingError: boolean = false;

    @Output()
    inputValueEmitter = new EventEmitter<InputChangesDto>();

    @Output()
    matchingCheckEmitter = new EventEmitter<InputChangesDto>();

    public error: string = '';

    public inputType?: 'password' | 'text';

    public inFocus: boolean = false;

    // emit(event: any) {
    //     this.inputValueEmitter.emit({
    //         inputValue : {
    //             [this.name]: event.target.value
    //         },
    //         error: this.error.length > 1 ? true : false,
    //         key: this.name
    //     })
    // }

    toggleVision(): void {
        if (this.inputType == 'password') this.inputType = 'text';
        else this.inputType = 'password';
    }

    ngOnChanges(): void {
        if (this.isMatchingError) {
            this.error = 'Passwords do not match';
        } else if (!this.requirements?.required && this.value.length < 1) {
            this.error = '';
        } else if (this.requirements?.required && (this.value.length == undefined || this.value.length < 1)) {
            this.error = `${this.UiName} is required.`;
        } else if (this.requirements?.isEmail && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.value)) {
            this.error = `${this.UiName} has to be a valid email`;
        } else if (this.requirements?.minLength && this.value.length < this.requirements?.minLength) {
            this.error = `${this.UiName} has to be longer than ${this.requirements?.minLength} characters.`;
        } else if (this.requirements?.maxLength && this.value.length > this.requirements?.maxLength) {
            this.error = `${this.UiName} has to be shorter than ${this.requirements?.maxLength} characters.`;
        } else {
            this.error = '';
        }
        this.inputValueEmitter.emit({
            value: this.value,
            error: this.error.length > 1 ? true : false,
            key: this.name,
        });
    }
}
