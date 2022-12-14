import React, { useEffect, useState } from "react";
import { useHttpClient } from "./../shared/http-hook";
// import Cookies from "universal-cookie";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { config } from "../shared/constants";
import Cookies from "js-cookie";

const Trips = () => {
  const { sendRequest, isLoading, setIsLoading } = useHttpClient();
  const [bookings, setBookings] = useState([]);
  // const cookies = new Cookies();
  // let token = cookies.get("token");

  const URL = config.url;
  const toast = useToast();
  const user_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        let responseData = await sendRequest(
          `${URL}/api/bookings/trips/${user_id}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setBookings(responseData.bookings);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        toast({
          title: "Cannot load places, please try again later",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchPlaces();
  }, [URL, sendRequest, setIsLoading, setBookings, token, user_id, toast]);

  //filtering place details based on attribute

  let pending_trips = [];
  let cancelled_trips = [];

  if (bookings) {
    pending_trips = bookings.filter((booking) => booking.status === "pending");
    cancelled_trips = bookings.filter(
      (booking) => booking.status === "cancelled"
    );
  }

  return (
    <div className="flex flex-col justify-center  p-8">
      <h1 className="pl-4 py-2 text-xl font-bold ">
        Upcoming trips ({bookings ? pending_trips.length : 0})
      </h1>
      {isLoading ? (
        <div className="flex flex-row justify-center items-center h-full ">
          <CircularProgress isIndeterminate />
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-2 max-w-7xl ">
          {bookings &&
            pending_trips.map((booking) => {
              const {
                start_date,
                end_date,
                place,
                host,
                title,
                _id,
                imageUrl,
              } = booking;
              let start_date_formatted =
                dayjs(start_date).format("MMM. D ,YYYY");
              let end_date_formatted = dayjs(end_date).format("MMM. D ,YYYY");

              return (
                <Link to={`/trips/${place}/${_id}`} key={_id}>
                  <div className="flex flex-row items-center">
                    <div className="flex justify-center w-24 h-24 ">
                      <img
                        className="w-full object-cover rounded-md"
                        src={imageUrl}
                        alt="treehouse"
                      />
                    </div>
                    <div className="flex flex-col w-2/3 pl-4 gap justify-center h-full">
                      <div className="font-bold truncate text-ellipsis">
                        {title}
                      </div>
                      <div className="text-slate-600 truncate text-ellipsis">
                        Hosted by: {host}
                      </div>
                      <div className="text-slate-600 truncate text-ellipsis">
                        {start_date_formatted} - {end_date_formatted}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
      <h1 className="pl-4 pt-8 pb-2 text-xl font-bold ">
        Canceled trips ({bookings ? cancelled_trips.length : 0})
      </h1>
      {isLoading ? (
        <div className="flex flex-row justify-center items-center h-full ">
          <CircularProgress isIndeterminate />
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-2 max-w-7xl ">
          {bookings &&
            cancelled_trips.map((booking) => {
              const {
                start_date,
                end_date,
                place,
                host,
                title,
                _id,
                imageUrl,
              } = booking;
              let start_date_formatted =
                dayjs(start_date).format("MMM. D ,YYYY");
              let end_date_formatted = dayjs(end_date).format("MMM. D ,YYYY");

              return (
                <Link to={`/trips/${place}/${_id}`} key={_id}>
                  <div className="flex flex-row items-center">
                    <div className="flex justify-center w-24 h-24">
                      <img
                        className="w-full object-cover rounded-md"
                        src={imageUrl}
                        alt="treehouse"
                      />
                    </div>
                    <div className="flex flex-col w-2/3 pl-4 gap justify-center h-full">
                      <div className="font-bold truncate text-ellipsis">
                        {title}
                      </div>
                      <div className="text-slate-600 truncate text-ellipsis">
                        Hosted by: {host}
                      </div>
                      <div className="text-slate-600 truncate text-ellipsis">
                        {start_date_formatted} - {end_date_formatted}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Trips;
