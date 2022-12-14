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

  const { status } = bookingDetail;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        let responseData = await sendRequest(`${URL}/api/places/${id}`);
        setLoadedPlaces(responseData.place);
        setIsLoading(false);
      } catch (err) {
        toast({
          title: "Cannot get booking information, please try again later",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
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
        toast({
          title: "Cannot get trips information, please try again later",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchBookingInfo();
    fetchPlaces();
  }, [URL, id, place, sendRequest, setIsLoading]);

  const { imageUrl, title } = loadedPlaces;
  const { start_date, end_date } = bookingDetail;

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
        toast({
          title: "Cannot cancel booking, please try again later",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
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
              {status && status === "pending" ? (
                <Button onClick={onOpen} colorScheme="red">
                  Cancel Booking
                </Button>
              ) : null}
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
