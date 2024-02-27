import useSWR from 'swr';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import fetcher from '@/lib/fetcher';
import { ApiResponse, Recipe } from '@/types/APIResponses';
import RecipeCard from './reicpeCard';

type RecipeListProps = {
  filters?: {
    title: string;
    categories: number[];
  };
  sort?: 'byRating' | 'byAge' | 'byTitle';
  limit?: number;
};

export default function RecipeList(props: RecipeListProps) {
  const url = `/api/recipe?limit=${props.limit}&sort=${props.sort}&categories=${props.filters?.categories}&title=${props.filters?.title}`;
  const { data, isLoading } = useSWR<ApiResponse<Recipe>>(url, fetcher);
  return (
    <Container
      fluid
      className="d-flex flex-row justify-content-start flex-wrap align-items-stretch"
    >
      {isLoading && <Spinner animation="border" />}
      {!isLoading && data && (
        <Row>
          {(data.content as Recipe[]).map((recipe: Recipe) => {
            return (
              <Col key={recipe.id} className="d-flex justify-content-stretch">
                <RecipeCard recipe={recipe} />
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

RecipeList.defaultProps = {
  filters: {
    title: '',
    categories: [],
  },
  sort: 'byRating',
  limit: 3,
};
