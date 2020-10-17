/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import image from "../../assets/images/logo.png";
import { AppContext } from "../../context/AppContext";
import ApplicationAlerts from "../components/ApplicationAlerts";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import { LoopIcon } from "../components/icons";

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [inputs, setInputs] = useState({ email: " ", password: "" });
  const { ApiServices, setUser, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { authentificationService } = ApiServices;
  const [Loading, setLoading] = useState(false);
  const history = useHistory();

 

  useEffect(() => {
    setUser();
  }, []);

  const goToVisitorsPage = () => {
    history.push("/visitors");
  };

  const handleInputsChange = (event) => {
    event.persist();

    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsError(false);

    try {
      const response = await authentificationService.login(inputs);
      if (response.status === 200) {
        setUser(response.data);
        pushAlert({
          type: "success",
          message: "Vous êtes connecté avec succès",
        });


        setTimeout(() => {
          if (response.data.hasConfirmed) history.push("/");
          else history.push("/settings/account");
        }, 1000);
      } else throw Error();
    } catch (e) {
      setLoading(false);
      pushAlert({
        message:
          "Votre email ou mot de passe n'est pas correct! essayez encore s'il vous plait",
      });
    }
  };

  return (
    <div className="page">
      <div className="page-single">
        <div className="container">
          <div className="row">
            <div className="col col-md-4 mx-auto">
              <div className="text-center mb-6 mt-6">
                <img src={image} className="h-6" alt="" />
              </div>
              <form className="card" onSubmit={handleSubmit}>
                <div className="card-body ">
                  <div className="card-title">
                    Connectez-vous à votre compte
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Adresse email</label>
                    <input
                      onChange={handleInputsChange}
                      value={inputs.email}
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Adresse email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                      onChange={handleInputsChange}
                      value={inputs.password}
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Mot de passe"
                    />
                  </div>
                </div>
                <ApplicationAlerts />
                <div className="card-footer">
                  <button type="submit" className="btn btn-block  btn-primary " onClick={()=>setLoading(true)}>
                    Se connecter
                  </button>
                  </div>
                  <ClipLoader
          css = {
            css`
            display: block;
            margin-left: auto;
            margin-right: auto;
            border-color: blue;
          `
          }
          size={70}
          color={"#123abc"}
          loading={Loading}
        />
                
              </form>
              <div className="m-2 text-center">
                <button
                  type="submit"
                  className="btn btn  btn-secondary "
                  onClick={goToVisitorsPage}
                >
                  <LoopIcon />
                  Chercher un auteur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
