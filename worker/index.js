self.addEventListener('install', evt => {
    console.log('service worker installed');
    self.__WB_DISABLE_DEV_LOGS = true;
});