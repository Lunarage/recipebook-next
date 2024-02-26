import type { ReactElement } from 'react';
import RecipeList from '@/components/Recipe/recipeList';

export default function Home(): ReactElement {
  return (
    <>
      <h1>Welcome!</h1>
      <h2 className="my-2">Newest Recipes</h2>
      <RecipeList byAge limit={3} />
      <h2 className="my-2">Top Rated Recipes</h2>
      <RecipeList byRating limit={3} />
    </>
  );
}
