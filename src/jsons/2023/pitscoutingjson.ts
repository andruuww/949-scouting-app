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
            errorMessage: 'Please provide a team number.',
        },
        {
            label: 'Drivetrain',
            placeholder: 'Select',
            type: FormElementsType.SELECT,
            name: 'drivetrain',
            options: ['Swerve', 'Tank', 'Mecanum', 'Other'],
        },
        {
            type: FormElementsType.GROUP,
            name: 'dimensions',
            elements: [
                {
                    placeholder: '28 in',
                    label: 'Length',
                    type: FormElementsType.NUMBER,
                    name: 'length',
                },
                {
                    placeholder: '32 in',
                    label: 'Width',
                    type: FormElementsType.NUMBER,
                    name: 'width',
                },
            ],
        },
        {
            label: 'Driver Practice Time',
            placeholder: '40 hrs',
            type: FormElementsType.NUMBER,
            name: 'driverHours',
        },
        {
            label: 'Scoring Level',
            type: FormElementsType.CHECKBOX,
            name: 'scoringLevel',
            options: ['Low', 'Medium', 'High'],
        },
        {
            label: 'Intake Capability',
            type: FormElementsType.CHECKBOX,
            name: 'intakeCapability',
            options: ['Cones', 'Cubes', 'Floor', 'Station'],
        },
        {
            label: 'Members',
            type: FormElementsType.COUNTER,
            name: 'members',
            settings: {
                increment: 10,
                min: 0,
                max: 200,
            },
        },
        {
            label: 'Additional Notes',
            placeholder: 'team lacked spare parts',
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
