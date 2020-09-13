const repoUrl = 'https://github.com/disneystreaming/automated-cloud-advisor';

const siteConfig = {
  title: 'Automated Cloud Advisor',
  tagline: '',
  url: 'http(s)://disneystreaming.github.io/',
  baseUrl: '/automated-cloud-advisor/',
  projectName: 'automated-cloud-advisor',
  organizationName: 'disneystreaming',
  githubHost: 'github.com',
  repoUrl,

  headerLinks: [
    { doc: 'start', label: 'Docs' },
    { href: repoUrl, label: "GitHub", external: true },
  ],

  headerIcon: 'img/dss_icon.svg',
  footerIcon: 'img/dss_icon.svg',
  favicon: 'img/favicon.ico',

  // From brand guidelines https://wiki.bamtechmedia.com/x/OzQBAw
  colors: {
    primaryColor: '#336699',
    secondaryColor: '#F1034A',
  },

  copyright: `Copyright © ${new Date().getFullYear()} Disney Streaming Services`,

  highlight: {
    theme: 'default',
  },

  scripts: ['https://buttons.github.io/buttons.js'],

  onPageNav: 'separate',
  cleanUrl: true,

  twitterImage: 'img/undraw_tweetstorm.svg',
  twitter: true,
  twitterUsername: 'disneystreaming',

};

module.exports = siteConfig;
