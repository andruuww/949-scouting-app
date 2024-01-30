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
                    placeholder: '1-64',
                    type: FormElementsType.NUMBER,
                    name: 'matchNumber',
                    required: true,
                    errorMessage: 'Please provide a match number.,
                },
                {
                    label: 'Team Number',
                    placeholder: '949',
                    type: FormElementsType.NUMBER,
                    name: 'teamNumber',
                    required: true,
                    errorMessage: 'Please provide a team number',
                },
            ],
        },
        {
            label: 'Robot Position',
            placeholder: 'Select',
            type: FormElementsType.SELECT,
            name: 'robotPosition',
            options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3'],
        },
        {
            type: FormElementsType.GROUP,
            name: 'robotInfo',
            elements: [
                {
                    label: 'Left Starting Zone',
                    type: FormElementsType.SWITCH,
                    name: 'leftStartingZone',
                },
                {
                    label: 'Charge Station Engaged',
                    type: FormElementsType.SWITCH,
                    name: 'isChargeStationEngaged',
                },
            ],
        },
        {
            label: 'Auto Scored Speaker',
            type: FormElementsType.COUNTER,
            name: 'autoScoredSpeaker',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Auto Scored Amp',
            type: FormElementsType.COUNTER,
            name: 'autoScoredAmp',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            type: FormElementsType.TITLE,
            label: 'TeleOperated',
        },
        {
            label: 'TeleOp Scored Speaker',
            type: FormElementsType.COUNTER,
            name: 'teleopScoredSpeaker',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'TeleOp Scored Amp',
            type: FormElementsType.COUNTER,
            name: 'teleOpScoredAmp',
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
