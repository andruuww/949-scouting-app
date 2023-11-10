export class FormDataClass {
    // scoutName? = string;
    // teamNumber? = number;
    // drivetrain? = 'tank' | 'swerve' | 'mech';
    // weight? = number;
    // dimensionLength? = number;
    // dimensionWidth? = number;
    // driverHours? = number;
    // scoringLevels? = string[];
    // intakeCapabilities? = string[];
    // notes? = string;

    scoutName? = '';
    teamNumber? = 0;
    drivetrain?: '';
    weight? = 0;
    dimensionLength? = 0;
    dimensionWidth? = 0;
    driverHours? = 0;
    scoringLevels?: string[] = [];
    intakeCapabilities?: string[] = [];
    notes? = '';
}

export interface FormData extends FormDataClass {}
