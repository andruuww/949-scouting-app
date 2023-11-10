const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    // disable: process.env.NODE_ENV === 'development',
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    cacheStartUrl: true
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA(nextConfig);

// const { nanoid } = require('nanoid')

// const pages = [
//     {
//       route: '/',
//       precacheHtml: false, // next-pwa already caches the home page
//       precacheJson: false, // no props
//     },
//     {
//       route: '/pit',
//       precacheHtml: true,
//       precacheJson: true,
//     },
//     {
//       route: '/export',
//       precacheHtml: true, // this is now the start url for A2HS
//       precacheJson: true,
//     },
//   ];

// function getStaticPrecacheEntries(){
//   // build list of manifest entries to precache content of public folder
// }

// function getGeneratedPrecacheEntries(buildId){
//   // build list of page entries, using buildId as revision for HTML files and as part of the url for JSON files
// }

// function getPageJSONPath(buildId, pageRoute){
//     return path.posix.join('/_next/data/', buildId, `${pageRoute}.json`);
//   }

//   function getJSONEntry(buildId, pageRoute){
//     return {
//       url: getPageJSONPath(buildId, pageRoute),
//       revision: null,
//     };
//   }

//   function getHTMLEntry(buildId, pageRoute){
//     return {
//       url: pageRoute,
//       revision: buildId,
//     };
//   }

//   function getNormalPageEntries(buildId, page){
//     let entries = [];
//     if (page.precacheHtml){
//       entries.push(getHTMLEntry(buildId, page.route));
//     }
//     if (page.precacheJson){
//       entries.push(getJSONEntry(buildId, page.route));
//     }
//     return entries;
//   }

//   function getDynamicPageEntries(buildId, page){
//     let pageList = page.dynamicPages.map(actualPage => path.posix.join(page.route, actualPage));
//     let entries = pageList.map(route => getNormalPageEntries(
//       buildId, { route: route, precacheHtml: page.precacheHtml, precacheJson: page.precacheJson })
//     );
//     return entries.reduce((acc, curr) => acc.concat(curr), []);
//   }

//   function getPageEntries(buildId, page){
//     if (Array.isArray(page.dynamicPages)){
//       return getDynamicPageEntries(buildId, page);
//     } else {
//       return getNormalPageEntries(buildId, page);
//     }
//   }

//   function getGeneratedPrecacheEntries(buildId){
//     return pages.map(page => getPageEntries(buildId, page)).reduce((acc, curr) => acc.concat(curr), []);
//   }

// const buildId = nanoid()

// const withPWA = require('next-pwa')
// const { PHASE_PRODUCTION_BUILD } = require('next/constants')

// module.exports = (phase, { defaultConfig }) => {
//   const config = {
//         ...defaultConfig,
//         pwa: {
//             dest: 'public',
//             dynamicStartUrl: false, // precache home page instead of storing it in runtime cache by default
//         },
//     }

//     if (phase === PHASE_PRODUCTION_BUILD){
//     // Attributes generateBuildId and additionalManifestEntries are only needed
//     // for the build and calculating their value is time-consuming.
//     // So we add them here, just for the build.
//     const getBuildId = require('./src/components/util/buildid.js')
//     const getStaticPrecacheEntries = require('./src/components/util/staticprecache.js')
//     // const getGeneratedPrecacheEntries = require('./src/components/util/precache.js')

//         const buildId = getBuildId()

//         config.generateBuildId = getBuildId
//         config.pwa.additionalManifestEntries = [
//       ...getStaticPrecacheEntries({
//         // exclude icon-related files from the precache since they are platform specific
//         // note: no need to pass publicExcludes to next-pwa, it's not used for anything else
//         publicExcludes: [
//           '!*.png',
//           '!*.ico',
//           '!browserconfig.xml',
//         ],
//       }),
//     //   ...getGeneratedPrecacheEntries(buildId),
//     ]
//     }

//   return withPWA(config)
// }
