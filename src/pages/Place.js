/* eslint-disable no-unreachable */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "./../shared/http-hook";
import { Button, Input, useToast, CircularProgress } from "@chakra-ui/react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { useAuth } from "../shared/auth-context";
import { config } from "../shared/constants";

const Place = () => {
  const { id } = useParams();
  const { sendRequest, setIsLoading, isLoading } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState({});
  const { isLoggedIn, requestLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  let created_date = dayjs().format("YYYY-MM-DD");
  let created_time = dayjs().format("h:mm:ss A");
  //calculate day difference
  let min_date = dayjs().add(2, "days").format("YYYY-MM-DD");

  const URL = config.url;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        let responseData = await sendRequest(`${URL}/api/places/${id}`);
        setLoadedPlaces(responseData.place);
        console.log(loadedPlaces);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPlaces();
  }, [setLoadedPlaces]);

  let reqUser = localStorage.getItem("id");
  let email = localStorage.getItem("user");

  const {
    imageUrl,
    bed,
    baths,
    title,
    formattedPrice,
    reviewCount,
    rating,
    cleaning_fees,
    service_fee,
    city,
    country,
    sq_ft,
    host,
  } = loadedPlaces;

  const onSubmit = async (values, actions) => {
    let updatedValues = {
      ...values,
      totalCost,
      status: "pending",
      title: title,
      host: host,
    };

    if (isLoggedIn) {
      fetch(`${URL}/api/bookings/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedValues),
      })
        .then((res) => res.json(), console.log())
        .then((data) =>
          data.message
            ? toast({
                title: "Please try again later",
                status: "error",
                duration: 9000,
                isClosable: true,
              })
            : (toast({
                title: "Booking request confirmed",
                status: "success",
                duration: 9000,
                isClosable: true,
              }),
              navigate("/trips"))
        )
        .catch((err) => console.log("error"));
    } else if (values.start_date && values.end_date) {
      requestLogin(true);
    }
  };

  const { values, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      place: id,
      created_date: created_date,
      created_time: created_time,
      start_date: "",
      end_date: "",
      user: reqUser,
      title: "",
      email: email,
      totalCost: "",
    },
    onSubmit,
  });

  const { start_date, end_date } = values;
  if (values.start_date) {
    min_date = dayjs(values.start_date).add(2, "days").format("YYYY-MM-DD");
  }

  let day_diff = Number(dayjs(end_date).diff(dayjs(start_date), "day"));
  const cost_per_night = (Number(day_diff) * Number(formattedPrice)).toFixed(2);
  const taxes = (
    (Number(formattedPrice) + Number(cleaning_fees)) *
    0.13
  ).toFixed(2);

  const totalCost = (
    Number(cost_per_night) +
    Number(cleaning_fees) +
    Number(taxes)
  ).toFixed(2);

  return (
    <div className="flex flex-col justify-center items-center">
      {isLoading ? (
        <div className="flex flex-row justify-center items-center w-full h-96 ">
          <CircularProgress isIndeterminate />
        </div>
      ) : (
        <>
          <div className="flex w-full pb-4 ">
            <div className="w-1/2 ">
              <img
                className="min-w-full min-h-full "
                alt="place"
                src={imageUrl}
              />
            </div>
            <div className="w-1/2 pl-2">
              <div className="grid grid-cols-2 gap-2">
                <img alt="place" src={imageUrl} />
                <img alt="place" src={imageUrl} />
                <img alt="place" src={imageUrl} />
                <img alt="place" src={imageUrl} />
              </div>
            </div>
          </div>
          <div className="flex flex-row max-w-screen-lg">
            <div className="w-3/5 px-8 py-2 ">
              <div className="text-xl font-bold pb-2">{title}</div>

              <div className="flex flex-row pb-4 text-sm font-light ">
                <div className="pr-2">{sq_ft} sq/ft</div>
                <div className="pr-2">
                  {city}, {country}
                </div>
              </div>

              <div>
                <p>
                  Manoir Blackswan is a living space, a private gallery, and a
                  creative studio designed with great attention to detail. Our
                  location offers endless possibilities for Photography,
                  Videography, Cinematography, Meetings, Podcasts & Small Events
                  as well.
                </p>
                <br />
                <p>
                  We are located in Châteauguay, on the south shore, 30 minutes
                  from downtown Montreal. The total floor space is more than
                  6000 sq2. The main floor is 1500 sq2 of open space with a
                  heated Harlequin Marble Floor, 12 ft tall ceilings, Handcarved
                  Marble Fireplace Mantle, Plaster moldings, a 18' long Island
                  which a 15' part is moveable for diners or conferences in
                  front of the fireplace. There is a Art Deco Psychedelic
                  Bathroom on the main floor as well.
                </p>
              </div>
            </div>

            <div className="w-2/5 pl-8">
              <div className="border border-black rounded px-4">
                <div className="flex flex-row justify-between items-center text-bold py-4">
                  <div className="flex pl-2 text-xl text-medium font-semibold ">
                    ${formattedPrice} per night
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col justify-around">
                    <p className="font-medium">Check-In</p>
                    <Input
                      id="start_date"
                      name="start_date"
                      value={values.start_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="md"
                      type="date"
                      min={created_date}
                      isRequired
                    />
                  </div>
                  <div className="flex flex-col justify-around pt-2">
                    <p className="font-medium">Check-Out</p>
                    <Input
                      id="end_date"
                      name="end_date"
                      value={values.end_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="md"
                      type="date"
                      min={min_date}
                      isRequired
                    />
                  </div>

                  <div className="flex flex-row justify-center py-2">
                    <Button className="w-full" type="submit" size="lg">
                      Reserve
                    </Button>
                  </div>

                  {(start_date.length > 0, end_date.length > 0) && (
                    <div className="flex flex-col pt-4">
                      <div className="flex w-full justify-between">
                        <div className="underline">
                          ${formattedPrice} CAD x {day_diff} nights
                        </div>
                        <div> ${cost_per_night} CAD</div>
                      </div>
                      <div className="flex w-full justify-between pt-4">
                        <div className="underline">Cleaning Fee</div>
                        <div> ${cleaning_fees.toFixed(2)} CAD</div>
                      </div>
                      <div className="flex w-full justify-between pt-4">
                        <div className="underline">Service Fee</div>
                        <div> ${service_fee.toFixed(2)} CAD</div>
                      </div>
                      <div className="flex w-full justify-between pt-4">
                        <div className="underline">Taxes</div>
                        <div> ${taxes} CAD</div>
                      </div>
                      <div className=" pt-4">
                        <hr />
                      </div>
                      <div className="flex w-full justify-between pt-4 pb-6">
                        <div className="font-bold">Total</div>
                        <div className="font-bold">
                          ${totalCost}
                          CAD
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Place;
