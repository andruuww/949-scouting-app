import { FormElementsType, JSONFormElement } from '@/lib/types';

const pitJSON: JSONFormElement = {
    type: FormElementsType.ROOT,
    name: 'pitScouting',
    label: 'Pit Scouting',
    required: true,
    // use unique special character, and keep as short as possible
    signature: '#',
    elements: [
        {
            label: 'Pit Scouting',
            type: FormElementsType.TITLE,
        },
        {
            label: 'Team Number',
            placeholder: '949',
            type: FormElementsType.NUMBER,
            name: 'teamNumber',
            required: true,
            errorMessage: 'Team number is required',
        },
        {
            label: 'Drivetrain',
            placeholder: 'Select a drivetrain',
            type: FormElementsType.SELECT,
            name: 'drivetrain',
            options: ['Swerve', 'Tank', 'Mecanum', 'Other'],
        },
        {
            label: 'Weight',
            placeholder: '100',
            type: FormElementsType.NUMBER,
            name: 'weight',
            required: false,
        },
        {
            type: FormElementsType.GROUP,
            name: 'dimensions',
            elements: [
                {
                    placeholder: '28',
                    label: 'Length',
                    type: FormElementsType.NUMBER,
                    name: 'length',
                    required: false,
                },
                {
                    placeholder: '32',
                    label: 'Width',
                    type: FormElementsType.NUMBER,
                    name: 'width',
                    required: false,
                },
            ],
        },
        {
            label: 'Driver Hours',
            placeholder: '40',
            type: FormElementsType.NUMBER,
            name: 'driverHours',
        },
        {
            label: 'Scoring Capability',
            type: FormElementsType.CHECKBOX,
            name: 'scoringLevelCapability',
            options: ['Trap', 'Amp', 'Speaker', 'None'],
        },
        {
            label: 'Scoring Preference',
            type: FormElementsType.SELECT,
            name: 'scoringLevelPreference',
            options: ['Trap', 'Amp', 'Speaker', 'None'],
            placeholder: 'Select a scoring preference',
        },
        {
            label: 'Speaker Score Distance',
            type: FormElementsType.NUMBER,
            name: 'speakerScoreDistance',
            placeholder: '30 feet',
            required: false,
        },
        {
            label: 'Intake Capability',
            type: FormElementsType.CHECKBOX,
            name: 'intakeCapability',
            options: ['Floor', 'Station', 'None'],
        },
        {
            label: 'Climb Capability',
            type: FormElementsType.CHECKBOX,
            name: 'climbCapability',
            options: ['Climb', 'Harmony', 'Buddy', 'None'],
        },
        {
            label: 'Additional Observations',
            placeholder: 'Missing backup parts, robot not put together',
            type: FormElementsType.TEXTAREA,
            name: 'additionalObservations',
            required: false,
        },
        {
            type: FormElementsType.CLEAR_SUBMIT_BUTTONS,
            options: ['Clear', 'Submit'],
        },
    ],
};

export default pitJSON;
