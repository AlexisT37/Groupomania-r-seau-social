import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Image } from "cloudinary-react";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const [imgIdForm, setImgId] = useState("");

  function ApplyUrl(value) {
    setImgId(value);
  }

  let history = useHistory();
  const initialValues = {
    title: "",
    postText: "",
    imgId: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Vous devez entrer un titre !"),
    postText: Yup.string().required("Vous devez entrer un contenu !"),
  });

  const onSubmit = (data) => {
    axios
      .post(
        "http://localhost:3001/posts",
        { ...data, imgId: imgIdForm },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        history.push("/");
      });
  };

  const uploadImage = (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "testupload");
    axios
      .post(
        "https://api.cloudinary.com/v1_1/testgroupopen/image/upload",
        formData
      )
      .then((response) => {
        ApplyUrl(response.data.public_id);
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Titre : </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Titre...)"
          />
          <label>Contenu : </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Contenu...)"
          />
          {/* <label>id : </label>
          <ErrorMessage name="imgId" component="span" />
          <h3>{imgIdForm}</h3>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="imgId"
            placeholder="(Ex. Collez l'id de votre image)"
          /> */}
          <input
            type="file"
            onChange={(event) => {
              uploadImage(event.target.files);
            }}
          ></input>
          {/* <button
            type="button"
            onClick={() => {
              initialValues.imgId = imgIdForm;
              console.log(imgIdForm);
              console.log(initialValues);
            }}
            className="uploadImage"
          >
            Valider
          </button> */}
          <button
            type="submit"
            onClick={() => {
              initialValues.imgId = imgIdForm;
            }}
          >
            {" "}
            Créer post
          </button>
        </Form>
      </Formik>
      <div className="image">
        <Image cloudName="testgroupopen" publicId={imgIdForm}></Image>
      </div>
    </div>
  );
}

export default CreatePost;
