import { FormElementsType, JSONFormElement } from '@/lib/types';

const matchJSON: JSONFormElement = {
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
                    placeholder: '64',
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
            name: 'robotPosition',
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
                    label: 'Charge Station Engaged',
                    type: FormElementsType.SWITCH,
                    name: 'isChargeStationEngaged',
                },
            ],
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
            label: 'Playstyle',
            placeholder: 'Select Playstyle',
            type: FormElementsType.SELECT,
            name: 'playstyle',
            options: ['None', 'Offensive', 'Defensive', 'Balanced'],
        },
        {
            label: 'Overall Match Notes',
            type: FormElementsType.TITLE,
        },
        {
            label: 'Yellow Card',
            type: FormElementsType.SWITCH,
            name: 'yellowCard',
        },
        {
            label: 'Broke Down',
            type: FormElementsType.SWITCH,
            name: 'brokeDown',
        },
        {
            type: FormElementsType.TEXTAREA,
            name: 'breakdownDescription',
            placeholder: 'Describe the breakdown',
            required: false,
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
                increment: 5,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Tech Fouls',
            type: FormElementsType.COUNTER,
            name: 'techFouls',
            settings: {
                increment: 12,
                min: 0,
                max: 100,
            },
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
            label: 'Additional Notes',
            type: FormElementsType.TEXTAREA,
            name: 'additionalNotes',
            placeholder: 'Enter any additional notes here',
            required: false,
        },
        {
            type: FormElementsType.CLEAR_SUBMIT_BUTTONS,
            options: ['Clear', 'Submit'],
        },
    ],
};

export default matchJSON;
