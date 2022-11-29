import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "./../shared/http-hook";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import {
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Map from "../shared/components/Map";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { config } from "../shared/constants";

const BookingDetails = () => {
  const { place, id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadedPlaces, setLoadedPlaces] = useState({});
  const [bookingDetail, setBookingDetails] = useState({});
  const { sendRequest, setIsLoading, isLoading } = useHttpClient();
  const toast = useToast();
  const navigate = useNavigate();

  const URL = config.url;
  console.log(id);
  console.log(place);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        let responseData = await sendRequest(`${URL}/api/places/${id}`);
        setLoadedPlaces(responseData.place);
        setIsLoading(false);
        console.log(loadedPlaces);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchBookingInfo = async () => {
      try {
        setIsLoading(true);
        let responseData = await sendRequest(
          `${URL}/api/bookings/trips/detail/${place}`
        );
        setBookingDetails(responseData.booking);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookingInfo();
    fetchPlaces();
  }, []);

  const { imageUrl, title } = loadedPlaces;
  const { start_date, end_date } = bookingDetail;

  console.log(bookingDetail);

  const cancelBooking = () => {
    setIsLoading(true);

    fetch(`${URL}/api/bookings/trips/${place}`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("/trips");
        toast({
          title: "Booking canceled",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col  h-screen p-2 rounded">
      {!isLoading && (
        <div className="flex flex-row  w-full h-full">
          <div className="sm:w-full md:w-1/2 w-1/3 max-w-xl">
            <div className="w-full relative">
              <img className="brightness-50" src={imageUrl} alt="hero" />
              <div className="absolute top-12 left-12">
                <Link to={`/trips`}>
                  <IoChevronBackCircleOutline color="white" size="36" />
                </Link>
                <div className="pt-2 font-bold text-2xl text-white">
                  Your Stay at {title}
                </div>
              </div>
            </div>
            <div className="flex flex-row pt-8 px-4">
              <div className="w-1/2 ">
                <div className="font-bold">Check-in</div>
                <div className="">
                  {dayjs(start_date).format("ddd. MMM. D ,YYYY")}
                </div>
                <div>3:00 p.m.</div>
              </div>
              <div className="w-1/2 ">
                <div className="font-bold">Checkout </div>
                <div className="">
                  {dayjs(end_date).format("ddd. MMM. D ,YYYY")}
                </div>
                <div>11:00 a.m.</div>
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={onOpen} colorScheme="red">
                Cancel Booking
              </Button>
            </div>
            {/* <div className="pl-4 ">
              <h1 className="py-2 text-xl font-bold">Your Booking Details</h1>
              <div>Hostname: </div>
            </div> */}
          </div>

          <div className="pl-2   w-full">
            <div className="w-full h-full bg-blue-100 ">
              <Map />
            </div>
          </div>
        </div>
      )}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              Are you sure you want to cancel this booking?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              colorScheme="blue"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button colorScheme="red" onClick={cancelBooking}>
              Cancel Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BookingDetails;
