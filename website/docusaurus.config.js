module.exports = {
  title: 'React-reparenting',
  tagline: 'The reparenting tools for React',
  url: 'https://paol-imi.github.io',
  baseUrl: '/react-reparenting/',
  favicon: 'logo/logo.svg',
  organizationName: 'paol-imi',
  projectName: 'react-reparenting',
  themeConfig: {
    announcementBar: {
      id: 'supportus',
      content:
        '⭐️ If you like React-reparenting, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/paol-imi/react-reparenting">GitHub</a>! ⭐️',
    },
    algolia: {
      apiKey: 'cc417223ab762185c5fb6de237deaba0',
      indexName: 'react-reparenting',
    },
    navbar: {
      title: 'React-reparenting',
      logo: {
        alt: 'React-reparenting Logo',
        src: 'logo/logo.svg',
      },
      links: [
        {
          to: 'docs/introduction',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/paol-imi/react-reparenting',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Paol-imi. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/paol-imi/react-reparenting/edit/master/website',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
