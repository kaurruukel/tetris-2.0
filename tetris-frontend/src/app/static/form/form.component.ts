import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputChangesDto } from '../input/input.event.interface';
import { FormInputs } from './interfaces/form.inputs.interface';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    constructor() {}
    ngOnInit(): void {
        this.inputsObject.inputs.forEach((input) => {
            let key = input.name;
            this.values = {
                ...this.values,
                [key]: '',
            };

            this.errors = {
                ...this.errors,
                [key]: input.requirements.required ? true : false,
            };

            this.matchingDependencies = {
                ...this.matchingDependencies,
                [key]: {
                    hasToMatch: input.hasToMatch,
                    hasToBeMatchedBy: input.hasToBeMatchedBy,
                    error: false,
                },
            };
        });
    }

    @Input()
    inputsObject!: FormInputs;

    @Output()
    submitForm = new EventEmitter<{ [key: string]: string }>();

    values: { [key: string]: string } = {};

    errors: object = {};

    submitAttempt: boolean = false;

    matchingDependencies: { [key: string]: { hasToMatch: string | undefined; hasToBeMatchedBy: string | undefined; error: boolean } } = {};

    valueChange(event: InputChangesDto): void {
        this.values = {
            ...this.values,
            [event.key]: event.value,
        };

        this.errors = {
            ...this.errors,
            [event.key]: event.error,
        };

        this.checkMatchingErrors(event);
    }

    submit(): void {
        this.submitAttempt = true;
        if (Object.values(this.errors).includes(true) || !this.checkIfMatchingErrorsExists()) return;
        this.submitForm.emit(this.values);
    }

    public checkMatchingErrors(event: InputChangesDto): void {
        const hasToBeMatchedBy = this.matchingDependencies[event.key].hasToBeMatchedBy;
        const hasToMatch = this.matchingDependencies[event.key].hasToMatch;

        if (!hasToBeMatchedBy && !hasToMatch) return;

        if (hasToBeMatchedBy) {
            this.matchingDependencies[hasToBeMatchedBy].error = this.values[hasToBeMatchedBy] == this.values[event.key] ? false : true;
        }
        if (hasToMatch) {
            this.matchingDependencies[event.key].error = this.values[hasToMatch] == this.values[event.key] ? false : true;
        }
    }

    private checkIfMatchingErrorsExists(): boolean {
        const listOfDependencies = Object.values(this.matchingDependencies);
        var valid = true;
        listOfDependencies.forEach((d) => {
            d.error == true ? (valid = false) : '';
        });
        return valid;
    }
}
