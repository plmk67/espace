import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormLabel,
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  FormHelperText,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Field, Form, useFormik } from "formik";
import { useAuth } from "../auth-context";
import { HiShieldCheck, HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import { config } from "../constants";

const LoginForm = (props) => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, loginHandler } = useAuth();
  const URL = config.url;
  const [error, setError] = useState();
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    fetch(`${URL}/api/users/signup`, {
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

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Password must be 8 or more characters")
      .required("Required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: SignupSchema,
    onSubmit,
  });

  console.log(errors);
  return (
    <div className="flex pt-2 pb-6 justify-center">
      <Formik>
        <Form onSubmit={handleSubmit} className="w-full px-8">
          <div className="pt-2">
            <Field name="name">
              {({ field, form }) => (
                <FormControl isInvalid={errors.name && touched.name}>
                  <InputGroup>
                    <InputLeftElement children={<HiUser />} />
                    <Input
                      value={values.name}
                      onChange={handleChange}
                      id="name"
                      type="name"
                      placeholder="full name"
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </div>
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

          <div className="pt-2">
            <Field name="confirm_password">
              {({ field, form }) => (
                <FormControl
                  isInvalid={
                    errors.confirm_password && touched.confirm_password
                  }
                >
                  <InputGroup>
                    <InputLeftElement children={<HiShieldCheck />} />
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="confirm password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.confirm_password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </div>
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
      </Formik>
    </div>
  );
};

export default LoginForm;
