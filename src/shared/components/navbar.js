import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../auth-context";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
} from "@chakra-ui/react";
import LoginForm from "./loginForm";
import SignUp from "./signupForm";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { VscHome, VscAccount, VscMenu, VscChromeClose } from "react-icons/vsc";
import { config } from "../constants";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, loginPrompt, requestLogin } = useAuth();

  const [isMenuClosed, setMenu] = useState(true);
  const [isLoginOpen, setLogin] = useState(false);
  const [isSignUpOpen, setSignUp] = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);

  let menuRef = useRef(null);
  const URL = config.url;
  const cookies = new Cookies();
  let token = cookies.get("token");
  const username = localStorage.getItem("user");

  useEffect(() => {
    if (loginPrompt) {
      toggleLogin();
      requestLogin(false);
    }

    let handler = (e) => {
      if (menuRef.current !== null && !menuRef.current.contains(e.target)) {
        setMenu(true);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const toggleLogin = () => {
    setLogin(!isLoginOpen);
  };

  const toggleMenu = () => {
    setMenu(!isMenuClosed);
  };

  const toggleSignUp = () => {
    setSignUp(!isSignUpOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(!isMobileMenuOpen);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    fetch(`${URL}/api/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) =>
        data.success
          ? (localStorage.clear(),
            setIsLoggedIn(false),
            window.location.reload())
          : console.log(data)
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-wrap ">
      <section className="mx-auto">
        <nav className="flex justify-between bg-gray-900 text-white w-screen">
          <div className="px-5 xl:px-12 py-6 flex items-center">
            <Link
              className="flex flex-row items-end text-3xl font-bold font-heading"
              to="/"
            >
              <div>
                <VscHome size={40} />
              </div>
              <div className="pl-2 ">espace</div>
            </Link>
          </div>

          <div className="flex justify-end px-5 py-6 font-semibold font-heading w-1/4">
            <ul className="flex items-center ">
              {isLoggedIn ? (
                <>
                  <div
                    ref={menuRef}
                    className="flex flex-row flex-start
                   relative "
                  >
                    <button
                      type="button"
                      className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      onClick={() => toggleMenu()}
                    >
                      <VscAccount size={30} />
                    </button>
                    <div
                      className="absolute top-6 right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                      hidden={isMenuClosed}
                      id="user-dropdown"
                    >
                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">
                          {username}
                        </span>
                      </div>
                      <ul className="py-1" aria-labelledby="user-menu-button">
                        <li>
                          <Link
                            to={"/trips"}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Trips
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/"
                            onClick={logout}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Sign out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div class="flex flex-row hidden md:flex">
                    <li className="pr-4">
                      <button
                        onClick={() => toggleSignUp()}
                        className="hover:text-gray-200"
                        href="/"
                      >
                        Sign Up
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => toggleLogin()}
                        className="hover:text-gray-200"
                      >
                        Login
                      </button>
                    </li>
                  </div>
                  <div className="md:hidden">
                    <div className=" ">
                      <button onClick={() => toggleMobileMenu()}>
                        <VscMenu size={25} />
                      </button>
                    </div>
                    <div
                      className="absolute top-0 right-0 z-20  w-full h-full text-base list-none bg-white  divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                      hidden={isMobileMenuOpen}
                    >
                      <div className="flex flex-row justify-end pt-4 pr-4 w-full ">
                        <button onClick={() => toggleMobileMenu()}>
                          <VscChromeClose size={30} />
                        </button>
                      </div>

                      <div className="flex flex-col ">
                        <button
                          onClick={() => toggleSignUp()}
                          className="block  w-full px-4 py-2 text-3xl text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Sign Up
                        </button>

                        <button
                          onClick={() => toggleLogin()}
                          className="block w-full px-4 py-2 text-3xl text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </nav>
      </section>
      <Modal isCentered isOpen={isSignUpOpen} onClose={() => toggleSignUp()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign Up</ModalHeader>
          <ModalCloseButton />
          <SignUp onClose={() => toggleSignUp()} />
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={isLoginOpen} onClose={() => toggleLogin()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log in</ModalHeader>
          <ModalCloseButton />
          <LoginForm onClose={() => toggleLogin()} />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Navbar;
