export type Ingredient = {
  id: number;
  name: string;
  amount: number;
  unit: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  name: string;
};

export type RecipeRating = {
  id: number;
  rating: number;
  User: User;
  recipeId: number;
};

export type Category = {
  id: number;
  name: string;
};

export type Recipe = {
  id: number;
  title: string;
  description: string;
  Ingredient: Ingredient[];
  steps: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
  RecipeRating: RecipeRating[];
  Category: Category[];
};

export type ApiResponse<T> = {
  message: string;
  content: T | {} | [];
};
