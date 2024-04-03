import { Requirements } from '../../interfaces/requirements.interface';

export interface FormInputs {
    inputs: InputConfig[];
}

export interface InputConfig {
    name: string;
    placeholder: string;
    uiValue: string;
    requirements: Requirements;
    isPassword: boolean;
    hasToMatch?: string;
    hasToBeMatchedBy?: string;
}
