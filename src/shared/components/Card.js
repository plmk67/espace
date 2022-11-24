import React, { useEffect, useState } from "react";
import { useAuth } from "../auth-context";
import { Link } from "react-router-dom";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { config } from "../constants";

import { useToast } from "@chakra-ui/react";
const Card = (props) => {
  const { property } = props;
  const {
    id,
    user,
    title,
    host,
    imageUrl,
    imageAlt,
    beds,
    baths,
    formattedPrice,
    reviewCount,
    city,
    country,
  } = property;

  const { isLoggedIn } = useAuth();
  const [isFavourite, setFavourite] = useState(false);
  const [favouriteList, setFavouriteList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const toast = useToast();
  const URL = config.url;

  const session_user = localStorage.getItem("id");

  useEffect(() => {
    setLoading(true);

    if (session_user) {
      fetch(`${URL}/api/favourite/${session_user}/${id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) =>
          data.favourite && data.favourite.length > 0
            ? setFavourite(true)
            : setFavourite(false)
        )
        .catch((err) => console.log(err));
    }

    setLoading(false);
  }, [isLoggedIn]);

  const toggleFavourite = (e) => {
    e.preventDefault();

    if (session_user) {
      isFavourite
        ? fetch(`${URL}/api/favourite/${session_user}/${id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((res) => res.json())
            .then((res) => console.log(res), setFavourite(false))
            .catch((err) => console.log(err))
        : fetch(`${URL}/api/favourite/create`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(favourite),
          })
            .then((res) => res.json())
            .then((res) => console.log(res), setFavourite(true))
            .catch((err) => console.log(err));
    } else {
      toast({
        title: "Login or sign up to add location to favourites",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const favourite = {
    place: id,
    user: session_user,
    title: title,
    host: host,
    imageUrl: imageUrl,
  };

  return (
    <div className="relative">
      <Link to={`/places/${id}/${title.toLowerCase()}`}>
        <div className="relative h-80 flex flex-col justify-between ">
          <div className="flex w-full h-2/3">
            <img
              className="object-cover w-full rounded-lg"
              src={imageUrl}
              alt={imageAlt}
            />
          </div>

          <div className="h-1/3 ">
            <div className="pt-2">
              <div className="font-bold">{title}</div>

              <div className="">
                {city}, {country}
              </div>
              <div className="flex flex-row">
                <div className="font-medium">${formattedPrice}.00 </div>
                <div>/ night</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div
        onClick={(e) => toggleFavourite(e)}
        className="z-10 absolute top-2 right-2"
      >
        {isFavourite ? (
          <HiHeart color="red" size={28} />
        ) : (
          <HiOutlineHeart size={28} />
        )}
      </div>
    </div>
  );
};

export default Card;
