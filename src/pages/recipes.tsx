import { useState, type ReactElement } from 'react';
import { Col, Form, FormControl, Row, Spinner } from 'react-bootstrap';
import useSWR from 'swr';
import { Search } from 'react-bootstrap-icons';
import RecipeList from '@/components/Recipe/recipeList';
import fetcher from '@/lib/fetcher';
import { ApiResponse, Category } from '@/types/APIResponses';

export default function Recipe(): ReactElement {
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useSWR<ApiResponse<Category[]>>('/api/category', fetcher);

  const [categoryFilters, setCategoryFilters] = useState<number[]>([]);

  const handleCategoryChange = (categoryId: number): void => {
    let categoryFiltersCopy = categoryFilters.slice();
    if (!categoryFiltersCopy.includes(categoryId)) {
      categoryFiltersCopy.push(categoryId);
    } else {
      categoryFiltersCopy = categoryFiltersCopy.filter((category) => {
        return category !== categoryId;
      });
    }
    setCategoryFilters(categoryFiltersCopy);
  };

  return (
    <Row>
      <Col md="3">
        <h2>Filters</h2>
        {categoriesIsLoading && <Spinner animation="border" />}
        {!categoriesError && !categoriesIsLoading && categoriesData && (
          <div>
            {(categoriesData.content as Category[]).map((category) => {
              return (
                <Form.Check
                  key={category.id}
                  label={category.name}
                  checked={categoryFilters.includes(category.id)}
                  onChange={() => {
                    handleCategoryChange(category.id);
                  }}
                />
              );
            })}
          </div>
        )}
      </Col>
      <Col md="9">
        <FormControl type="text" />
        <RecipeList
          sort="byAge"
          limit={20}
          filters={{ categories: categoryFilters, title: '' }}
        />
      </Col>
    </Row>
  );
}
