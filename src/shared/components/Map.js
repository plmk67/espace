import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useHttpClient } from "../http-hook";
import { CircularProgress } from "@chakra-ui/react";
import { config } from "../constants";
const containerStyle = {
  display: "flex",
  width: "100%",
  height: "100%",
};

const Map = () => {
  const { sendRequest, isLoading, setIsLoading } = useHttpClient();
  const [mapInstance, setMapInstance] = useState();
  const [accessToken, setAccessToken] = useState();

  const URL = config.url;

  const marker_coord = {
    lat: 45.547,
    lng: -73.627,
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        let responseData = await sendRequest(
          `http:/localhost:4000/api/places/googleMapsReq`
        );
        setAccessToken(responseData.API_KEY);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchToken();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-row justify-center items-center w-full h-96 ">
          <CircularProgress isIndeterminate />
        </div>
      ) : (
        <LoadScript googleMapsApiKey={accessToken}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            defaultOptions={{ mapTypeControl: false }}
            center={{
              lat: 45.547,
              lng: -73.627,
            }}
            zoom={16}
            onLoad={(map) => setTimeout(() => setMapInstance(map))}
          >
            {mapInstance && (
              <Marker
                position={{
                  lat: 45.547,
                  lng: -73.627,
                }}
                visible={true}
              />
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </>
  );
};

export default Map;
