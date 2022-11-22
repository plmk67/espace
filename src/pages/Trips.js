import React, { useEffect, useState } from "react";
import { useHttpClient } from "./../shared/http-hook";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
import { config } from "../shared/constants";

const Trips = () => {
  const { sendRequest, isLoading, setIsLoading } = useHttpClient();
  const [bookings, setBookings] = useState([]);

  const cookies = new Cookies();
  const URL = config.url;
  let token = cookies.get("token");

  const user_id = localStorage.getItem("id");

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
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        );
        setBookings(responseData.booking);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPlaces();
  }, []);

  console.log(bookings);

  //filtering place details based on attribute

  let cancelled_trips = [];
  let pending_trips = [];
  if (bookings) {
    cancelled_trips = bookings.filter(
      (booking) => booking.status === "cancelled"
    );

    pending_trips = bookings.filter((booking) => booking.status === "pending");

    console.log(cancelled_trips);
    console.log(pending_trips);
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
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4 w-full">
          {bookings &&
            pending_trips.map((booking) => {
              const { start_date, end_date, place, host, title, _id } = booking;
              let start_date_formatted =
                dayjs(start_date).format("MMM. D ,YYYY");
              let end_date_formatted = dayjs(end_date).format("MMM. D ,YYYY");

              return (
                <Link to={`/trips/${place}/${_id}`}>
                  <div className="flex flex-row items-center ">
                    <div className="w-1/3 ">
                      <img
                        className="rounded-md"
                        src="https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2019/4/17/0/HUHH2019-Escape_Fall-City-WA_19.jpg.rend.hgtvcom.966.725.suffix/1555507098172.jpeg"
                        alt="treehouse"
                      />
                    </div>
                    <div className="flex flex-col w-2/3 pl-4 gap justify-center h-full">
                      <div className="font-bold">{title}</div>
                      <div className="text-slate-600">Hosted by: {host}</div>
                      <div className="text-slate-600">
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
