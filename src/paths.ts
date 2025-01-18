export const Path = {
  root: '/',
  home: '/home',
  questCategories: '/quests/categories',
  questCategory: '/quests/categories/:id',
  questSearch: '/quests/search',
  quest: '/quests/q/:id',
};

export const Routes = {
  root: () => '/',
  home: () => '/home',
  questCategories: () => '/quests/categories',
  questCategory: (id: string) => `/quests/categories/${id}`,
  questSearch: () => '/quests/search',
  quest: (id: string) => `/quests/q/${id}`,
}