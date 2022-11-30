import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { config } from "../constants";
import { Formik, Field, Form, useFormik } from "formik";
import { useAuth } from "../auth-context";
import { HiMail, HiLockClosed } from "react-icons/hi";

const LoginForm = (props) => {
  const { setIsLoggedIn, setUser } = useAuth();
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
              name: data.name,
            }),
            localStorage.setItem("user", data.email),
            localStorage.setItem("id", data.id),
            props.onClose(),
            navigate("/"))
          : setError(data.message)
      )
      .catch((err) => console.log(err));
    actions.resetForm();
  };

  const {
    values,
    errors,
    touched,

    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <div className="flex pt-2 pb-6 justify-center">
      <Formik>
        <Form onSubmit={handleSubmit} className="w-full px-8">
          <div className="pt-2">
            <Field name="email">
              {({ field, form }) => (
                <FormControl isInvalid={errors.email && touched.email}>
                  <InputGroup>
                    <InputLeftElement children={<HiMail />} />
                    <Input
                      value={values.email}
                      onChange={handleChange}
                      id="email"
                      type="email"
                      placeholder="email"
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </div>
          <div className="pt-2">
            <Field name="password">
              {({ field, form }) => (
                <FormControl isInvalid={errors.password && touched.password}>
                  <InputGroup>
                    <InputLeftElement children={<HiLockClosed />} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </div>
          <FormControl isInvalid={errors}>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
