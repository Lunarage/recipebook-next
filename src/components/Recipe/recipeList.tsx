import useSWR from 'swr';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import fetcher from '@/lib/fetcher';
import { Recipe } from '@/types/APIResponses';
import RecipeCard from './reicpeCard';

type RecipeListProps = {
  byAge?: boolean;
  byRating?: boolean;
  limit?: number;
};

export default function RecipeList(props: RecipeListProps) {
  let url = `/api/recipe?limit=${props.limit}`;
  if (props.byAge) {
    url += '&byAge=true';
  }
  if (props.byRating) {
    url += '&byRating=true';
  }
  const { data, isLoading } = useSWR(url, fetcher);
  return (
    <Container
      fluid
      className="d-flex flex-row justify-content-start flex-wrap align-items-stretch"
    >
      {isLoading && <Spinner animation="border" />}
      {!isLoading && data && (
        <Row>
          {data.content.map((recipe: Recipe) => {
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
  byAge: false,
  byRating: false,
  limit: 3,
};
