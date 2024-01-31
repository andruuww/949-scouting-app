import { FormElementsType, JSONFormElement } from '@/lib/types';

const matchJSON: JSONFormElement = {
    type: FormElementsType.ROOT,
    name: 'matchScouting',
    label: 'Match Scouting',
    required: true,
    signature: '%',
    elements: [
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
                    errorMessage: 'Please provide a match number.'
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
            label: 'Starting Position',
            placeholder: 'Select',
            type: FormElementsType.SELECT,
            name: 'robotPosition',
            options: ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3'],
        },
        {
            type: FormElementsType.TITLE,
            label: 'Starting'
        },
        {
            type: FormElementsType.GROUP,
            name: 'startingPosition',
            elements: [
                {
                    label: 'Alliance Color',
                    placeholder: 'Select',
                    type: FormElementsType.SELECT,
                    name: 'color',
                    options: [
                        'Red',
                        'Blue'
                    ]
                },
                {
                    label: 'Position',
                    placeholder: 'Select',
                    type: FormElementsType.SELECT,
                    name: 'position',
                    options: [
                        '[1] Near',
                        '[2] Middle',
                        '[3] Far'
                    ]
                }
            ]
        },
        {
            type: FormElementsType.TITLE,
            label: 'Autonomous',
        },
        {
            type: FormElementsType.GROUP,
            name: 'autoBonuses',
            elements: [
                {
                    label: 'Left Starting Zone',
                    type: FormElementsType.SWITCH,
                    name: 'leftStartingZone',
                },
                {
                    label: 'Preloaded Note', //yes ik this isnt a bonus, but it just feels right to put it together with starting zone
                    type: FormElementsType.SWITCH,
                    name: 'preloadedNote',
                },
            ],
        },
        {
            label: 'Auto: Amp',
            type: FormElementsType.COUNTER,
            name: 'autoPlayedAmp',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Auto: Speaker',
            type: FormElementsType.COUNTER,
            name: 'Auto Speaker',
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
            label: 'TeleOp: Amp',
            type: FormElementsType.COUNTER,
            name: 'teleOpAmp',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'TeleOp: Base Speaker',
            type: FormElementsType.COUNTER,
            name: 'teleopBaseSpeaker',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'TeleOp: Amplified Speaker',
            type: FormElementsType.COUNTER,
            name: 'teleopAmplifiedSpeaker',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            }
        },
        {
            label: 'TeleOp: Missed Speaker',
            type: FormElementsType.COUNTER,
            name: 'missedSpeaker',
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
        },
        {
            label: 'Coopertition',
            type: FormElementsType.SWITCH,
            name: 'coopertition',
        },
        {
            label: 'Fouls',
            type: FormElementsType.TITLE,
        },
        {
            label: 'Foul',
            type: FormElementsType.COUNTER,
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
            name: 'regularFoul'
        },
        {
            label: 'Tech Foul',
            type: FormElementsType.COUNTER,
            settings: {
                increment: 1,
                min: 0,
                max: 100,
            },
            name: 'techFoul'
        },
        {
            label: 'Yellow Card',
            type: FormElementsType.SWITCH,
            name: 'yellowCard'
        },
        {
            label: 'Red Card', // results in disqualification
            type: FormElementsType.SWITCH,
            name: 'redCard'
        },
        {
            label: 'Disabled',
            type: FormElementsType.SWITCH,
            name: 'Ddsabled',
        },
        {
            label: 'Endgame',
            type: FormElementsType.TITLE,
            name: 'trap'
        },
        {
            label: 'End Position',
            type: FormElementsType.SELECT,
            options: ['None', 'Podium', 'Stage']
        },
        {
            label: 'Trap',
            type: FormElementsType.SWITCH,
            name: 'Trap', // robot scores note into the goal thats inside the podium. based on animation, i THINK you have to be onstage to do this
        },
        {
            label: 'Harmony',
            type: FormElementsType.SWITCH, //max of 2 robots can fit on one chain, so max 1 harmony point, so i used switch instead of counter
        },
        {
            label: 'Microphone',
            type: FormElementsType.SWITCH,
            name: 'microphone',
        },
        {
            label: 'Overall Notes',
            type: FormElementsType.TITLE,
        },
        {
            label: 'Playstyle',
            placeholder: 'Select Playstyle',
            type: FormElementsType.SELECT,
            name: 'playstyle',
            options: ['None', 'Offensive', 'Defensive', 'Balanced'], 
            // would recommend removing the None option. this would force scouters to try their best to pick one of the other three.
            // also we could have a "Wild" style to replace None in case the robot was way too unpredictable
        },
        {
            label: 'Break Down',
            type: FormElementsType.SWITCH,
            name: 'breakDown',
        },
        {
            type: FormElementsType.TEXTAREA,
            name: 'breakdownDescription',
            placeholder: 'Describe how the robot broke down. ',
            required: false,
        },
        {
            label: 'Additional Notes',
            type: FormElementsType.TEXTAREA,
            name: 'additionalNotes',
            placeholder: 'Enter any additional notes here.',
            required: false,
        },
        {
            type: FormElementsType.CLEAR_SUBMIT_BUTTONS,
            options: ['Clear', 'Submit'],
        },
    ],
};

export default matchJSON;
