import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import fetcher from '@/lib/fetcher';
import RecipeRatingBox from '@/components/Recipe/recipeRating';
import { ApiResponse, Recipe } from '@/types/APIResponses';

export default function RecipePage() {
  const { status } = useSession();
  const router = useRouter();
  const rid = Number(router.query.rid);
  const [scaling, setScaling] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<boolean[]>([]);

  const { data, error, isLoading } = useSWR<ApiResponse<Recipe>>(
    `/api/recipe/${rid}`,
    fetcher,
  );
  const recipe = data?.content as Recipe;
  const withModal = status === 'authenticated';

  const handleSetActiveStep = (index: number) => {
    const activeStepCopy = activeStep.slice();
    activeStepCopy[index] = !activeStepCopy[index];
    setActiveStep(activeStepCopy);
  };

  return (
    <Container>
      {!error && isLoading && <Spinner animation="border" />}
      {recipe && !isLoading && (
        <Row className="gx-5">
          <Col className="col-md-auto">
            <h2>Ingredients</h2>
            <div className="form-floating">
              <input
                id="scaling-input"
                type="number"
                className="form-control text-end"
                style={{ width: '17ch' }}
                value={scaling}
                onChange={(event) => {
                  setScaling(Number(event.target.value));
                }}
                min="0"
              />
              <label htmlFor="scaling-input">Scaling</label>
            </div>
            {recipe.Ingredient &&
              recipe.Ingredient.map((ingredient) => {
                return (
                  <div
                    key={ingredient.name}
                    className="row justify-content-center align-items-center gx-0"
                  >
                    <div className="col-auto">
                      <input
                        disabled
                        className="form-control text-end"
                        style={{ width: '10ch' }}
                        value={
                          Math.round(100 * ingredient.amount * scaling) / 100
                        }
                      />
                    </div>
                    <div className="col-auto">
                      <input
                        disabled
                        className="form-control"
                        style={{ width: '7ch' }}
                        value={ingredient.unit}
                      />
                    </div>
                    <div className="col">
                      <span className="px-1">{ingredient.name}</span>
                    </div>
                  </div>
                );
              })}
          </Col>
          <Col>
            <h1>{recipe.title}</h1>
            <RecipeRatingBox
              ratings={recipe.RecipeRating}
              rid={rid}
              size={32}
              withModal={withModal}
            />
            <p className="mt-2 mb-1">{recipe.description}</p>
            {recipe.steps && (
              <>
                <h2>Steps</h2>
                {recipe.steps.map((step, index) => {
                  return (
                    <ul className="list-group list-group-horizontal" key={step}>
                      <Button
                        className="list-group-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          handleSetActiveStep(index);
                        }}
                      >
                        {index + 1}
                      </Button>
                      {activeStep[index] && (
                        <li className="list-group-item active">{step}</li>
                      )}
                      {!activeStep[index] && (
                        <li className="list-group-item">{step}</li>
                      )}
                    </ul>
                  );
                })}
              </>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}
