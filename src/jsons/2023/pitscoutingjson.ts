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
                },
                {
                    placeholder: '32',
                    label: 'Width',
                    type: FormElementsType.NUMBER,
                    name: 'width',
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
            options: ['Trap', 'Amp', 'Speaker'],
        },
        {
            label: 'Scoring Preference',
            type: FormElementsType.SELECT,
            name: 'scoringLevelPreference',
            options: ['Amp', 'Speaker'],
        },
        {
            label: 'Speaker Score Distance',
            type: FormElementsType.NUMBER,
            name: 'speakerScoreDistance',
            placeholder: 'in feet, if can score speaker',
            required: false,
        },
        {
            label: 'Intake Capability',
            type: FormElementsType.CHECKBOX,
            name: 'intakeCapability',
            options: ['Floor', 'Station'],
        },
        /*{
            label: 'Members',
            type: FormElementsType.COUNTER,
            name: 'members',
            settings: {
                increment: 10,
                min: 0,
                max: 200,
            },
        },*/
        {
            label: 'Climb Capability',
            type: FormElementsType.CHECKBOX,
            name: 'climbCapability',
            options: ['Climb','Harmony','Double', 'None'],
        },
        {
            label: 'Additional Notes',
            placeholder: 'If any above section is blank or unknown explain here',
            type: FormElementsType.TEXTAREA,
            name: 'additionalNotes',
            required: false,
        },
        {
            type: FormElementsType.CLEAR_SUBMIT_BUTTONS,
            options: ['Clear', 'Submit'],
        },
    ],
};
 
export default pitJSON;
 