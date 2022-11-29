/* eslint-disable no-unreachable */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "./../shared/http-hook";
import { Button, Input, useToast, CircularProgress } from "@chakra-ui/react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { useAuth } from "../shared/auth-context";
import { config } from "../shared/constants";

import { addDays, format, addMonths, differenceInDays } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import styles from "react-day-picker/dist/style.css";

const Place = () => {
  const { id } = useParams();
  const { sendRequest, setIsLoading, isLoading } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState({});
  const { isLoggedIn, requestLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const pastMonth = new Date();

  const disabledDays = { from: new Date(0, 0, 0), to: new Date() };

  let created_date = dayjs().format("YYYY-MM-DD");
  let created_time = dayjs().format("h:mm:ss A");
  //calculate day difference
  let min_date = dayjs().add(2, "days").format("YYYY-MM-DD");

  const [range, setRange] = useState({
    from: pastMonth,
    to: addDays(pastMonth, 2),
  });

  let diffDays;
  if (range) {
    diffDays = differenceInDays(range.to, range.from);
  }

  const URL = config.url;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        let responseData = await sendRequest(`${URL}/api/places/${id}`);
        setLoadedPlaces(responseData.place);

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
      imageUrl: imageUrl,
      start_date: range.from,
      end_date: range.to,
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
        .then((res) => res.json())
        .then((data) =>
          data.message
            ? toast({
                title: "Please try again later",
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            : (toast({
                title: "Booking request confirmed",
                status: "success",
                duration: 5000,
                isClosable: true,
              }),
              navigate("/trips"))
        )
        .catch((err) => console.log("error"));
    } else if (range.to && range.from) {
      toast({
        title: "Please sign up or login to reserve",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
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

  // let day_diff = Number(dayjs(end_date).diff(dayjs(start_date), "day"));
  const cost_per_night = (Number(diffDays) * Number(formattedPrice)).toFixed(2);
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
            <div className="sm:w-full md:w-1/2 ">
              <img
                className="min-w-full min-h-full "
                alt="place"
                src={imageUrl}
              />
            </div>
            <div className="sm:w-0 md:w-1/2 pl-2">
              <div className="grid grid-cols-2 gap-2">
                <img alt="place" src={imageUrl} />
                <img alt="place" src={imageUrl} />
                <img alt="place" src={imageUrl} />
                <img alt="place" src={imageUrl} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start px-6 md:flex-row  sm:flex-end min-w-screen-lg max-w-screen-xl min-w-24 ">
            <div className="sm:px-6 md:w-3/5 ">
              <div className="text-xl font-bold pb-2">{title}</div>

              <div className="flex flex-row pb-4 text-sm font-light ">
                <div className="pr-2">{sq_ft} sq/ft</div>
                <div className="pr-2">
                  {city}, {country}
                </div>
              </div>

              <div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  ultrices eros sit amet turpis semper, at efficitur magna
                  mollis. Vivamus vitae vestibulum velit. Aliquam nec faucibus
                  augue. Nullam vitae risus ligula. Etiam sed pharetra nunc. Sed
                  porta ultrices ante, non pretium eros dictum eget. Aenean
                  pulvinar risus lorem, quis consequat dolor feugiat vitae.
                  Mauris vitae scelerisque purus, sit amet efficitur dui. Nulla
                  eget turpis ac diam ornare feugiat eget eget est.
                </p>
                <br />
                <p>
                  Nulla vulputate dui non neque feugiat pellentesque. Donec
                  volutpat, erat a fringilla molestie, augue lectus ullamcorper
                  diam, sit amet interdum nulla eros sit amet nisi. Vestibulum
                  faucibus neque massa, non gravida eros sodales id. Nullam
                  elementum erat varius neque malesuada, id pellentesque mauris
                  porta. Etiam rutrum posuere diam, at gravida ante vestibulum
                  id. Sed venenatis diam ultricies urna pretium pellentesque.
                  Maecenas in fermentum nulla. Maecenas mattis nulla tincidunt
                  tempor tempus. Duis massa mi, mollis sit amet ligula quis,
                  sagittis ornare enim. Nullam gravida leo ultrices tempor
                  aliquet.
                </p>
              </div>
            </div>

            <div className="pt-4 sm:w-full sm:px-6 md:w-[400px]">
              <div className="border border-black rounded px-4">
                <div className="flex flex-row justify-between items-center text-bold py-4">
                  <div className="flex pl-2 text-xl text-medium font-semibold ">
                    ${formattedPrice} per night
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col justify-around">
                    <div className="flex justify-center">
                      <DayPicker
                        mode="range"
                        showOutsideDays
                        defaultMonth={pastMonth}
                        disabled={disabledDays}
                        selected={range}
                        onSelect={setRange}
                        max={60}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row justify-center py-2">
                    <div hidden={diffDays > 0 ? true : false}>
                      Add dates to calculate prices for your stay
                    </div>
                    <Button
                      hidden={diffDays > 0 ? false : true}
                      className="w-full"
                      type="submit"
                      size="lg"
                    >
                      Reserve
                    </Button>
                  </div>

                  {diffDays > 0 && (
                    <div className="flex flex-col pt-4">
                      <div className="flex w-full justify-between">
                        <div>
                          ${formattedPrice} CAD x {diffDays} nights
                        </div>
                        <div> ${cost_per_night} CAD</div>
                      </div>
                      <div className="flex w-full justify-between pt-4">
                        <div>Cleaning Fee</div>
                        <div> ${cleaning_fees.toFixed(2)} CAD</div>
                      </div>
                      <div className="flex w-full justify-between pt-4">
                        <div>Service Fee</div>
                        <div> ${service_fee.toFixed(2)} CAD</div>
                      </div>
                      <div className="flex w-full justify-between pt-4">
                        <div>Taxes</div>
                        <div> ${taxes} CAD</div>
                      </div>
                      <div className=" pt-4">
                        <hr />
                      </div>
                      <div className="flex w-full justify-between pt-4 pb-6">
                        <div className="font-bold">Total</div>
                        <div className="font-bold">
                          $
                          {(
                            Number(cost_per_night) +
                            Number(cleaning_fees) +
                            Number(taxes)
                          ).toLocaleString("en-US")}{" "}
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
