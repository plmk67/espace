import React from "react";
import { Box, Badge, Image, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Card = (props) => {
  const { property } = props;

  return (
    <div className="h-80 flex flex-col justify-between  ">
      <div className="flex w-full h-2/3">
        <img
          className="object-cover w-full rounded-lg"
          src={property.imageUrl}
          alt={property.imageAlt}
        />
      </div>
      <div className="h-1/3 ">
        <div className="pt-4">
          <div display="flex" alignItems="baseline">
            <div
              className="font-light"
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {property.beds} beds &bull; {property.baths} baths
            </div>
          </div>

          <div className="font-bold">
            <Link to={`/places/${property.id}/${property.title.toLowerCase()}`}>
              {property.title}
            </Link>
          </div>

          <div>${property.formattedPrice}.00 / night</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
