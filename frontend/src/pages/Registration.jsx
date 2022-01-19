import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3)
      .max(15)
      .required("Vous devez entrer un nom d'utilisateur !"),
    password: Yup.string()
      .min(8)
      .max(20)
      .required("Votre mot de passe n'a pas un bon format !"),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(() => {
      // console.log(data);
      window.location.pathname = "/login";
    });
  };

  return (
    <div>
      {/* //todo br formulaire: facon simple mais peut-etre editer margin du div au dessus de ce commentaire*/}
      {/* br pour aérer le formulaire de la barre de navigation */}
      {/* <br /> */}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Nom d'utilisateur : </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. Martin18...)"
          />
          <label>Mot de passe : </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            /* pour que le mot de passe ne soit pas visible mais des petits points noirs */
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="(Ex. Mot#Depasse926Trèsfort...)"
          />

          <button type="submit"> Créer utilisateur </button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
