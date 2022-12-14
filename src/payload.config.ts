import { buildConfig } from 'payload/config';
import path from 'path';

import Users from './collections/Users';
import Blog from './collections/Blog';
import Coverage from './collections/Coverage';
import Organisation from './collections/Organisation';
import Individual from './collections/Individual';
import Authors from './collections/Authors';
import Media from './collections/Media';

import Principles from './globals/principles';
import Bill from './globals/bill';

import seo from '@payloadcms/plugin-seo';

import { Icon } from './components/Icon';
import AfterDashboard from './components/AfterDashboard';

import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { adapter } from './utils/s3';
import Homepage from './globals/homepage';

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    disable: false,
    user: Users.slug,
    meta: {
      titleSuffix: '- Save our Privacy',
      favicon: '/assets/favicon.png',
    },
    components: {
      graphics: {
        Logo: Icon,
        Icon,
      },
      afterDashboard: [AfterDashboard],
    },
    webpack: config => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          fallback: {
            ...config.resolve?.fallback,
            fs: false,
          },
        },
      };
    },
  },
  rateLimit: {
    trustProxy: process.env.NODE_ENV === 'production',
  },
  globals: [Principles, Bill, Homepage],
  collections: [Users, Authors, Blog, Coverage, Individual, Organisation, Media],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    seo({
      collections: ['blog'],
      uploadsCollection: 'media',
      globals: ['principles', 'bill'],
      tabbedUI: true,
    }),
    cloudStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          adapter: adapter, // see docs for the adapter you want to use
        },
      },
    }),
  ],
});
