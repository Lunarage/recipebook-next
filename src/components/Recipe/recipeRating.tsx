import React, { useState } from 'react';
import { Star, StarFill } from 'react-bootstrap-icons';
import { Button, Modal } from 'react-bootstrap';
import { RecipeRating } from '@/types/APIResponses';

function StarButton({
  fill,
  size,
  color,
  onClick,
}: {
  fill: boolean;
  size: number;
  color: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <div>
        {fill ? (
          <StarFill
            size={size}
            color={color}
            style={{ cursor: 'pointer' }}
            onClick={onClick}
          />
        ) : (
          <Star
            size={size}
            style={{ cursor: 'pointer' }}
            color={color}
            onClick={onClick}
          />
        )}
      </div>
    );
  }
  return (
    <div>
      {fill ? (
        <StarFill size={size} color={color} />
      ) : (
        <Star size={size} color={color} />
      )}
    </div>
  );
}

StarButton.defaultProps = {
  onClick: undefined,
};

function RatingModal({
  rid,
  showModal,
  setShowModal,
}: {
  rid: number;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [rating, setRating] = useState<number>(5);
  const [starFill, setStarfill] = useState<number>(5);

  const giveRating = () => {
    const data = { rid, rating };
    fetch(`/api/recipe/${rid}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        setShowModal(false);
      });
    // .catch((error) => {});
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Give rating</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-row align-items-center justify-content-center">
        <StarButton
          fill={starFill >= 1}
          color="blue"
          size={32}
          onClick={() => {
            setRating(1);
            setStarfill(1);
          }}
        />
        <StarButton
          fill={starFill >= 2}
          color="blue"
          size={32}
          onClick={() => {
            setRating(2);
            setStarfill(2);
          }}
        />
        <StarButton
          fill={starFill >= 3}
          color="blue"
          size={32}
          onClick={() => {
            setRating(3);
            setStarfill(3);
          }}
        />
        <StarButton
          fill={starFill >= 4}
          color="blue"
          size={32}
          onClick={() => {
            setRating(4);
            setStarfill(4);
          }}
        />
        <StarButton
          fill={starFill >= 5}
          color="blue"
          size={32}
          onClick={() => {
            setRating(5);
            setStarfill(5);
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={giveRating}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function RecipeRatingBox({
  rid,
  ratings,
  size,
  withModal,
}: {
  rid: number;
  ratings: RecipeRating[];
  size: number;
  withModal: boolean;
}) {
  const [showModal, setShowModal] = useState<boolean>(false);

  let ratingValue = 0;
  const ratingCount = ratings.length;
  if (ratingCount) {
    const ratingSum = ratings
      .map((rating) => {
        return rating.rating;
      })
      .reduce((acc, currValue) => {
        return acc + currValue;
      }, 0);
    ratingValue = Number((ratingSum / ratingCount).toFixed(1));
  }

  return (
    <div className="container d-flex flex-row flex-nowrap align-items-center px-0">
      {withModal && (
        <RatingModal
          rid={rid}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <StarButton
        fill={ratingValue >= 1}
        color="blue"
        size={size}
        onClick={() => {
          setShowModal(true);
        }}
      />
      <StarButton
        fill={ratingValue >= 2}
        color="blue"
        size={size}
        onClick={() => {
          setShowModal(true);
        }}
      />
      <StarButton
        fill={ratingValue >= 3}
        color="blue"
        size={size}
        onClick={() => {
          setShowModal(true);
        }}
      />
      <StarButton
        fill={ratingValue >= 4}
        color="blue"
        size={size}
        onClick={() => {
          setShowModal(true);
        }}
      />
      <StarButton
        fill={ratingValue >= 5}
        color="blue"
        size={size}
        onClick={() => {
          setShowModal(true);
        }}
      />
      <span className="px-1 py-1">
        Rating: {ratingValue} / 5 ({ratingCount} ratings)
      </span>
    </div>
  );
}
