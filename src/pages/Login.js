import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormLabel,
  FormControl,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useHttpClient } from "./../shared/http-hook";
import { Formik, Field, Form, useFormik } from "formik";
import { useAuth } from "../shared/auth-context";
import { config } from "../shared/constants";
const Forms = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, loginHandler } = useAuth();

  const [error, setError] = useState();
  const navigate = useNavigate();
  const URL = config.url;
  
  const onSubmit = async (values, actions) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    fetch(`${URL}/api/users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) =>
        data.email && data.id
          ? (setIsLoggedIn(true),
            setUser({
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
            }),
            setError(false),
            console.log(data),
            localStorage.setItem("user", data.email),
            localStorage.setItem("id", data.id),
            navigate("/"))
          : (setIsLoggedIn(false), setError(data.message))
      )
      .catch((err) => console.log(err));

    actions.resetForm();
  };

  const { values, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <div className="flex justify-center pt-48 h-screen">
      <div className="flex flex-col w-96 justify-start mx-2">
        <Formik>
          {(props) => (
            <Form onSubmit={handleSubmit}>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      value={values.email}
                      onChange={handleChange}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="name">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <FormLabel>Password</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {error && <h1 className="text-red-400">{error}</h1>}
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Forms;
