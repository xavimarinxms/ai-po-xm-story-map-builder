import { StoryMap } from '@/types';

export const SAMPLE_MAP: StoryMap = {
  title: 'NovaPay — Onboarding Flow',
  releases: [
    { id: 'r1', name: 'MVP', color: '#1a73e8' },
    { id: 'r2', name: 'v1.1', color: '#16a34a' },
    { id: 'r3', name: 'Backlog', color: '#9ca3af' },
  ],
  storyReleases: {
    's1': 'r1', 's2': 'r1', 's3': 'r1',
    's4': 'r1', 's5': 'r2', 's6': 'r2',
    's7': 'r1', 's8': 'r2', 's9': 'r3',
    's10': 'r1', 's11': 'r1', 's12': 'r2',
    's13': 'r2', 's14': 'r3', 's15': 'r3',
  },
  activities: [
    {
      id: 'a1',
      title: 'Sign up',
      tasks: [
        {
          id: 't1', title: 'Create account',
          stories: [
            { id: 's1', title: 'Enter email and password', size: 'S' },
            { id: 's2', title: 'Verify email address', size: 'S' },
            { id: 's3', title: 'Google OAuth sign-up', size: 'M' },
          ],
        },
        {
          id: 't2', title: 'Company profile',
          stories: [
            { id: 's4', title: 'Enter company name and size', size: 'S' },
            { id: 's5', title: 'Upload company logo', size: 'S' },
            { id: 's6', title: 'Add VAT / tax ID', size: 'M' },
          ],
        },
      ],
    },
    {
      id: 'a2',
      title: 'Connect bank',
      tasks: [
        {
          id: 't3', title: 'Link bank account',
          stories: [
            { id: 's7', title: 'Search and select bank via Plaid', size: 'M' },
            { id: 's8', title: 'Manual IBAN entry fallback', size: 'M' },
            { id: 's9', title: 'Multi-currency account support', size: 'L' },
          ],
        },
        {
          id: 't4', title: 'Verify account',
          stories: [
            { id: 's10', title: 'Micro-deposit verification', size: 'M' },
            { id: 's11', title: 'Real-time balance check', size: 'S' },
            { id: 's12', title: 'Verification status notifications', size: 'S' },
          ],
        },
      ],
    },
    {
      id: 'a3',
      title: 'First payment',
      tasks: [
        {
          id: 't5', title: 'Send payment',
          stories: [
            { id: 's13', title: 'Enter recipient and amount', size: 'M' },
            { id: 's14', title: 'Schedule future payment', size: 'M' },
            { id: 's15', title: 'Payment templates / recurring', size: 'L' },
          ],
        },
      ],
    },
  ],
};

export const EMPTY_MAP: StoryMap = {
  title: 'My story map',
  releases: [
    { id: 'r1', name: 'MVP', color: '#1a73e8' },
    { id: 'r2', name: 'v1.1', color: '#16a34a' },
    { id: 'r3', name: 'Backlog', color: '#9ca3af' },
  ],
  storyReleases: {},
  activities: [],
};
