import { FormElementsType, JSONFormElement } from '@/lib/types';

const pitJSON: JSONFormElement = {
    type: FormElementsType.ROOT,
    name: 'matchScouting',
    label: 'Match Scouting',
    required: true,
    signature: '%',
    elements: [
        {
            type: FormElementsType.TITLE,
            label: 'Autonomous',
        },
        {
            type: FormElementsType.GROUP,
            name: 'matchInfo',
            elements: [
                {
                    label: 'Match Number',
                    placeholder: '1',
                    type: FormElementsType.NUMBER,
                    name: 'matchNumber',
                    required: true,
                    errorMessage: 'Match number is required',
                },
                {
                    label: 'Team Number',
                    placeholder: '949',
                    type: FormElementsType.NUMBER,
                    name: 'teamNumber',
                    required: true,
                    errorMessage: 'Team number is required',
                },
            ],
        },
        {
            label: 'Robot Position',
            placeholder: 'Select Position',
            type: FormElementsType.SELECT,
            name: 'drivetrain',
            options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3'],
        },
        {
            type: FormElementsType.GROUP,
            name: 'robotInfo',
            elements: [
                {
                    label: 'Left Community',
                    type: FormElementsType.SWITCH,
                    name: 'leftCommunity',
                },
                {
                    label: 'Auto Charge Station',
                    type: FormElementsType.SWITCH,
                    name: 'chargeStation',
                },
            ],
        },
        {
            label: 'Auto Scored Low',
            type: FormElementsType.COUNTER,
            name: 'autoScoredLow',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Auto Scored Medium',
            type: FormElementsType.COUNTER,
            name: 'autoScoredMedium',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Auto Scored High',
            type: FormElementsType.COUNTER,
            name: 'autoScoredHigh',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            type: FormElementsType.TITLE,
            label: 'Teleoperated',
        },
        {
            label: 'Game Pieces Scored',
            type: FormElementsType.CHECKBOX,
            name: 'gamePiecesScored',
            options: ['Cones', 'Cubes'],
            required: false,
        },
        {
            label: 'Scored Low',
            type: FormElementsType.COUNTER,
            name: 'scoredLow',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Scored Medium',
            type: FormElementsType.COUNTER,
            name: 'scoredMedium',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Scored High',
            type: FormElementsType.COUNTER,
            name: 'scoredHigh',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Missed',
            type: FormElementsType.COUNTER,
            name: 'missed',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Playstsyle',
            placeholder: 'Select Playstyle',
            type: FormElementsType.SELECT,
            name: 'playstyle',
            options: ['Offensive', 'Defensive', 'Balanced'],
        },
        {
            label: 'Links',
            type: FormElementsType.COUNTER,
            name: 'links',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Fouls',
            type: FormElementsType.COUNTER,
            name: 'fouls',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Tech Fouls',
            type: FormElementsType.COUNTER,
            name: 'techFouls',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Broke Down',
            type: FormElementsType.SWITCH,
            name: 'brokeDown',
        },
        {
            label: 'Charge Station Points',
            type: FormElementsType.COUNTER,
            name: 'chargeStationPoints',
            settings: {
                increment: 10,
                min: 0,
                max: 30,
            },
        },
        {
            label: 'Bonuses',
            type: FormElementsType.CHECKBOX,
            name: 'bonuses',
            options: ['Sustainability', 'Cooperation', 'Activation'],
            required: false,
        },
        {
            type: FormElementsType.CLEAR_SUBMIT_BUTTONS,
            options: ['Clear', 'Submit'],
        },
    ],
};

export default pitJSON;
