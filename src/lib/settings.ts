import { CounterStyles, SwitchStyles } from './types';

export default class Settings {
    constructor() {}

    public static getSetting(setting: string): any {
        if (typeof window === 'undefined' || !localStorage || !localStorage.getItem('SETTINGS')) {
            return null;
        }
        return JSON.parse(localStorage.getItem('SETTINGS')!)[setting];
    }

    public static setSetting(setting: string, value: any) {
        let settings = localStorage.getItem('SETTINGS') ? JSON.parse(localStorage.getItem('SETTINGS')!) : {};
        settings[setting] = value;
        localStorage.setItem('SETTINGS', JSON.stringify(settings));
    }

    public static getCameraID(): string {
        return Settings.getSetting('cameraID') ? Settings.getSetting('cameraID') : '';
    }

    public static setCameraID(cameraID: string) {
        Settings.setSetting('cameraID', cameraID);
    }

    public static getSwitchStyle(): string {
        return Settings.getSetting('switchStyle') ? Settings.getSetting('switchStyle') : SwitchStyles.NORMAL;
    }

    public static setSwitchStyle(style: string) {
        Settings.setSetting('switchStyle', style);
    }

    public static getCounterStyle(): string {
        return Settings.getSetting('counterStyle') ? Settings.getSetting('counterStyle') : CounterStyles.CENTER;
    }

    public static setCounterStyle(style: string) {
        Settings.setSetting('counterStyle', style);
    }
}
