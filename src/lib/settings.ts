export default class Settings {
    constructor() {}

    public static getSetting(setting: string) {
        if (typeof window === 'undefined') {
            return {};
        }
        return localStorage.getItem('SETTINGS') ? JSON.parse(localStorage.getItem('SETTINGS')!)[setting] : {};
    }

    public static setSetting(setting: string, value: any) {
        let settings = localStorage.getItem('SETTINGS') ? JSON.parse(localStorage.getItem('SETTINGS')!) : {};
        settings[setting] = value;
        localStorage.setItem('SETTINGS', JSON.stringify(settings));
    }

    public static getCameraID() {
        return Settings.getSetting('cameraID') ? Settings.getSetting('cameraID') : '';
    }

    public static setCameraID(cameraID: string) {
        Settings.setSetting('cameraID', cameraID);
    }
}
