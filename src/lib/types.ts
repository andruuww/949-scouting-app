export interface FormData {
    scoutName?: string;
    teamNumber?: number;
    drivetrain?: 'tank' | 'swerve' | 'mech';
    weight?: number;
    dimensionLength?: number;
    dimensionWidth?: number;
    driverHours?: number;
    scoringLevels?: string[];
    intakeCapabilities?: string[];
    notes?: string;
}

export interface LoginForm {
    name: string;
}

export interface FormCollection {
    forms: FormData[];
}
