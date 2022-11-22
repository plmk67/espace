import React, { useState, useEffect } from "react";
import { CircularProgress } from "@chakra-ui/react";
import { useHttpClient } from "./../shared/http-hook";
import { useAuth } from "../shared/auth-context";
import Card from "../shared/components/Card";

const Home = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { sendRequest, isLoading } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        let responseData = await sendRequest(
          "http://localhost:4000/api/places"
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest]);

  console.log(isLoading);
  return (
    <div className="flex justify-center bg-grey-100 pt-4">
      <div className="grid justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
        {isLoading ? (
          <div className="flex flex-row w-full h-96 justify-content items-center">
            <CircularProgress isIndeterminate />
          </div>
        ) : (
          <>
            {loadedPlaces.map((property, index) => {
              return <Card property={property} key={index} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
