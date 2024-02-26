import Link from 'next/link';
import { Card } from 'react-bootstrap';
import { Recipe } from '@/types/APIResponses';
import RecipeRatingBox from './recipeRating';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="link-underline link-underline-opacity-0 d-flex align-items-stretch flex-grow-1"
    >
      <Card className="flex-grow-1">
        <Card.Img variant="top" />
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Subtitle className="text-muted">
            By {recipe.author.name}
          </Card.Subtitle>
          <RecipeRatingBox
            rid={recipe.id}
            ratings={recipe.RecipeRating}
            size={24}
            withModal={false}
          />
          <Card.Text>
            {recipe.description.split(' ').splice(0, 25).join(' ')}
            {recipe.description.split(' ').length > 25 && '...'}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}
