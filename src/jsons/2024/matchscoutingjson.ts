import { FormElementsType, JSONFormElement } from '@/lib/types';
import { Label } from '@radix-ui/react-label';

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
            label: 'Left Community',
            type: FormElementsType.SWITCH,
            name: 'leftCommunity',
        },
        {
            label: 'Amp Notes Scored',
            type: FormElementsType.COUNTER,
            name: 'autoAmp',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Speaker Notes Scored',
            type: FormElementsType.COUNTER,
            name: 'autoSpeaker',
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
            label: 'Amp Notes Scored',
            type: FormElementsType.COUNTER,
            name: 'teleopAmp',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },

        {
            label: 'Unamped Speaker Notes Scored',
            type: FormElementsType.COUNTER,
            name: 'teleopSpeaker',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Amped Speaker Notes Scored',
            type: FormElementsType.COUNTER,
            name: 'teleopAmpedSpeaker',
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
            label: 'Endgame',
            type: FormElementsType.TITLE,
        },
        {
            label: 'Trap',
            type: FormElementsType.COUNTER,
            name: 'Trap',
            settings: {
                increment: 1,
                min: 0,
                max: 3,
            },
        },
        {
            label: 'Ending State',
            type: FormElementsType.SELECT,
            name: 'endgameState',
            options: ['None', 'Parked', 'Climb', 'Harmony', 'Double Harmony'],
            placeholder: 'Select Ending State',
        },
        {
            label: 'Mic',
            type: FormElementsType.SWITCH,
            name: 'mic',
        },
        {
            label: 'Overall',
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
            label: 'Playstyle',
            placeholder: 'Select Playstyle',
            type: FormElementsType.SELECT,
            name: 'playstyle',
            options: ['None', 'Offensive', 'Defensive', 'Balanced'],
        },
        {
            label: 'Observations',
            type: FormElementsType.TEXTAREA,
            name: 'observations',
            placeholder: 'If the robot broke down, enter the nature of the breakdown here.',
            required: false,
        },
        {
            label: 'Results',
            type: FormElementsType.TITLE,
        },
        {
            type: FormElementsType.GROUP,
            name: 'score',
            elements: [
                {
                    label: 'Red Score',
                    type: FormElementsType.NUMBER,
                    name: 'redScore',
                    placeholder: '10',
                },
                {
                    label: 'Blue Score',
                    type: FormElementsType.NUMBER,
                    name: 'blueScore',
                    placeholder: '19',
                },
            ],
        },
        {
            label: 'Match Win',
            type: FormElementsType.SWITCH,
            name: 'didWin',
        },
        {
            type: FormElementsType.GROUP,
            name: 'rankingBonus',
            elements:[
                {
                    type: FormElementsType.SWITCH,
                    name: 'melody',
                    label: 'Melody',
                },
                {
                    type: FormElementsType.SWITCH,
                    name: 'ensemble',
                    label: 'Ensemble',
                }
            ],
        },
        {
            type: FormElementsType.CLEAR_SUBMIT_BUTTONS,
            options: ['Clear', 'Submit'],
        },
    ],
};

export default matchJSON;
