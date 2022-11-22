import React from "react";
import { Box, Badge, Image, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Card = (props) => {
  const { property } = props;

  return (
    <Box
      key={property.key}
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="whiteAlpha.700"
    >
      <Image src={property.imageUrl} alt={property.imageAlt} />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {property.beds} beds &bull; {property.baths} baths
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          <Link to={`/places/${property.id}/${property.title.toLowerCase()}`}>
            {property.title}
          </Link>
        </Box>

        <Box>
          ${property.formattedPrice}.00
          <Box as="span" color="gray.600" fontSize="sm">
            / wk
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
