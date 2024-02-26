import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  FloatingLabel,
  Form,
  Button,
  Stack,
  Badge,
  InputGroup,
} from 'react-bootstrap';
import { Plus, X } from 'react-bootstrap-icons';
import { ApiResponse, Recipe } from '@/types/APIResponses';

interface Step {
  number: number;
  text: string;
}

interface Ingredient {
  number: number;
  name: string;
  amount: number;
  unit: string;
}

export default function CreateRecipe() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [steps, setSteps] = useState<Step[]>([{ number: 1, text: '' }]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { number: 1, name: '', amount: 0, unit: '' },
  ]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  if (status === 'unauthenticated') {
    router.push('/login');
  }

  const onSubmit = async () => {
    const data = {
      authorId: session?.user.id,
      title,
      ingredients: ingredients
        .filter((ingredient) => {
          return ingredient.amount && ingredient.name && ingredient.unit;
        })
        .map((ingredient) => {
          return {
            amount: ingredient.amount,
            unit: ingredient.unit,
            name: ingredient.name,
          };
        }),
      steps: steps
        .filter((step) => {
          return step.text;
        })
        .map((step) => {
          return step.text;
        }),
      description,
    };
    fetch('/api/recipe/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((response: ApiResponse<Recipe>) => {
        if (response.message === 'OK') {
          router.push(`/recipe/${(response.content as Recipe).id}`);
        }
      });
  };

  const addStep = (): void => {
    setSteps(steps.concat({ number: steps.length + 1, text: '' }));
  };

  const handleStepChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ): void => {
    const target = event.target as HTMLTextAreaElement;
    const targetStepIndex = steps.findIndex((step) => {
      return step.number === Number(target.dataset.key);
    });
    const stepsCopy = steps.slice();
    stepsCopy[targetStepIndex].text = target.value;
    setSteps(stepsCopy);
  };

  const addIngredient = (): void => {
    setIngredients(
      ingredients.concat({
        number: ingredients.length + 1,
        name: '',
        amount: 0,
        unit: '',
      }),
    );
  };

  const handleIngredientChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetIngredientIndex = ingredients.findIndex((ingredient) => {
      return ingredient.number === Number(target.dataset.key);
    });
    const ingredientsCopy = ingredients.slice();
    if (target.dataset.field === 'amount') {
      ingredientsCopy[targetIngredientIndex].amount = Number(target.value);
    } else if (target.dataset.field === 'unit') {
      ingredientsCopy[targetIngredientIndex].unit = target.value;
    } else if (target.dataset.field === 'name') {
      ingredientsCopy[targetIngredientIndex].name = target.value;
    }
    setIngredients(ingredientsCopy);
  };

  return (
    <Container className="align-items-center justify-content-lg-center">
      <form
        className="col-md-auto"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Row>
          <Col md="4">
            <h2>Ingredients</h2>
            {ingredients.map((ingredient) => {
              return (
                <Row key={ingredient.number}>
                  <Col className="p-0 py-1">
                    <FloatingLabel
                      controlId={`ingredient-amount-input-${ingredient.number}`}
                      label="Amount"
                    >
                      <Form.Control
                        type="number"
                        value={ingredient.amount}
                        data-field="amount"
                        data-key={ingredient.number}
                        onChange={handleIngredientChange}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col className="p-0 py-1">
                    <FloatingLabel
                      controlId={`ingredient-unit-input-${ingredient.number}`}
                      label="Unit"
                    >
                      <Form.Control
                        type="text"
                        value={ingredient.unit}
                        data-field="unit"
                        data-key={ingredient.number}
                        onChange={handleIngredientChange}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col className="p-0 py-1">
                    <FloatingLabel
                      controlId={`ingredient-name-input-${ingredient.number}`}
                      label="Ingredient"
                    >
                      <Form.Control
                        type="text"
                        value={ingredient.name}
                        data-field="name"
                        data-key={ingredient.number}
                        onChange={handleIngredientChange}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              );
            })}
            <Button type="button" onClick={addIngredient}>
              Add ingredient
            </Button>
          </Col>
          <Col md="8">
            <FloatingLabel controlId="title-input" label="Title">
              <Form.Control
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId="description-input" label="Description">
              <Form.Control
                as="textarea"
                style={{ height: '10rem' }}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </FloatingLabel>
            {steps.map((step) => {
              return (
                <FloatingLabel
                  key={step.number}
                  controlId={`step${step.number}`}
                  label={`Step ${step.number}`}
                >
                  <Form.Control
                    as="textarea"
                    style={{ height: '10rem' }}
                    onChange={handleStepChange}
                    data-key={step.number}
                    value={step.text}
                  />
                </FloatingLabel>
              );
            })}
            <Button type="button" onClick={addStep}>
              Add step
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Categories</h2>
            <InputGroup className="flex-shrink-1" style={{ width: '25ch' }}>
              <Form.Control
                type="text"
                placeholder="Search"
                style={{ width: '15ch' }}
              />
              <Button type="button">
                <Plus size={24} />
              </Button>
            </InputGroup>
            <Stack direction="horizontal" className="border rounded-2 p-2">
              <Badge className="d-flex align-items-center fs-6 pe-1 ps-2">
                Foo
                <Button
                  type="button"
                  className="m-0 p-0 d-flex align-items-center"
                >
                  <X size={24} className="m-0 p-0" />
                </Button>
              </Badge>
            </Stack>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </form>
    </Container>
  );
}
