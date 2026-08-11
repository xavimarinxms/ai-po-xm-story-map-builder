export interface Story {
  id: string;
  title: string;
  size?: 'S' | 'M' | 'L' | 'XL';
}

export interface UserTask {
  id: string;
  title: string;
  stories: Story[];
}

export interface Activity {
  id: string;
  title: string;
  tasks: UserTask[];
}

export interface Release {
  id: string;
  name: string;
  color: string;
}

export interface StoryMap {
  title: string;
  activities: Activity[];
  releases: Release[];
  // storyId -> releaseId assignment
  storyReleases: Record<string, string>;
}
