import { FormElementsType, JSONFormElement } from '@/lib/types';

// const pitJSON: JSONFormElement = {
//     type: FormElementsType.ROOT,
//     name: 'pitScouting',
//     required: true,
//     elements: [
//         {
//             label: 'Team Number',
//             placeholder: '949',
//             type: FormElementsType.NUMBER,
//             name: 'teamNumber',
//             required: true,
//             errorMessage: 'Team number is required',
//         },
//         {
//             label: 'Drivetrain',
//             placeholder: 'Select a drivetrain',
//             type: FormElementsType.SELECT,
//             name: 'drivetrain',
//             options: ['Swerve', 'Tank', 'Mecanum', 'Other'],
//         },
//         {
//             label: 'Weight',
//             placeholder: '100',
//             type: FormElementsType.NUMBER,
//             name: 'weight',
//         },
//         {
//             label: 'Dimensions',
//             required: true,
//             type: FormElementsType.GROUP,
//             name: 'dimensions',
//             elements: [
//                 {
//                     placeholder: '28',
//                     label: 'Length',
//                     type: FormElementsType.NUMBER,
//                     name: 'length',
//                 },
//                 {
//                     placeholder: '32',
//                     label: 'Width',
//                     type: FormElementsType.NUMBER,
//                     name: 'width',
//                 },
//             ],
//         },
//         {
//             label: 'Driver Hours',
//             placeholder: '40',
//             type: FormElementsType.NUMBER,
//             name: 'driverHours',
//         },
//         {
//             label: 'Scoring Level',
//             type: FormElementsType.CHECKBOX,
//             name: 'scoringLevel',
//             options: ['Low', 'Medium', 'High'],
//         },
//         {
//             label: 'Intake Capability',
//             type: FormElementsType.CHECKBOX,
//             name: 'intakeCapability',
//             options: ['Cones', 'Cubes', 'Floor', 'Station'],
//         },
//         {
//             label: 'Penalties',
//             type: FormElementsType.COUNTER,
//             name: 'penalties',
//             settings: {
//                 increment: 10,
//                 min: -10,
//                 max: 55,
//             },
//         },
//         {
//             label: 'Additional Notes',
//             placeholder: 'team lacked spare parts',
//             type: FormElementsType.TEXTAREA,
//             name: 'additionalNotes',
//             required: false,
//         },
//         {
//             type: FormElementsType.SUBMIT,
//             label: 'Finish Scouting Team',
//         },
//     ],
// };

const pitJSON: JSONFormElement = {
    type: FormElementsType.ROOT,
    name: 'pitScouting',
    required: true,
    elements: [
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
            label: 'Dimensions',
            required: true,
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
            label: 'test',
            placeholder: 'hey',
            type: FormElementsType.TEXT,
            name: 'test',
        },
        {
            label: 'Driver Hours',
            placeholder: '40',
            type: FormElementsType.NUMBER,
            name: 'driverHours',
        },
        {
            label: 'Scoring Level',
            type: FormElementsType.CHECKBOX,
            name: 'scoringLevel',
            options: ['Low', 'Medium', 'High', 'Other'],
        },
        {
            label: 'Intake Capability',
            type: FormElementsType.CHECKBOX,
            name: 'intakeCapability',
            options: ['Cones', 'Cubes', 'Floor', 'Station', 'Other'],
        },
        {
            label: 'Members',
            type: FormElementsType.COUNTER,
            name: 'members',
            settings: {
                increment: 10,
                min: -10,
                max: 55,
            },
        },
        {
            type: FormElementsType.SUBMIT,
            label: 'Finish Scouting Team',
        },
    ],
};

export default pitJSON;
