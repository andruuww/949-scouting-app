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
