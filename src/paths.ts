export const Path = {
  root: '/',
  home: '/home',
  questCategories: '/quests/categories',
  questCategory: '/quests/categories/:id',
  questSearch: '/quests/search',
  quest: '/quests/q/:id',
  skillCategories: '/skills/categories',
  skillCategory: '/skills/categories/:id',
  skillSearch: '/skills/search',
  skill: '/skills/s/:id',
};

export const Routes = {
  root: () => '/',
  home: () => '/home',
  questCategories: () => '/quests/categories',
  questCategory: (id: string) => `/quests/categories/${id}`,
  questSearch: () => '/quests/search',
  quest: (id: string) => `/quests/q/${id}`,
  skillCategories: () => '/skills/categories',
  skillCategory: (id: string) => `/skills/categories/${id}`,
  skillSearch: () => '/skills/search',
  skill: (id: string) => `/skills/s/${id}`,
}