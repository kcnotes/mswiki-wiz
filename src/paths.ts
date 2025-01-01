export const Path = {
  root: '/',
  home: '/home',
  questCategories: '/quests/categories',
  questCategory: '/quests/categories/:id',
  questSearch: '/quests/search',
  quest: '/quests/:id',
};

export const Routes = {
  root: () => '/',
  home: () => '/home',
  questCategories: () => '/quests/categories',
  questCategory: (id: string) => `/quests/categories/${id}`,
  questSearch: () => '/quests/search',
  quest: (id: string) => `/quests/${id}`,
}