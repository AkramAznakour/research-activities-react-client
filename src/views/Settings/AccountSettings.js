import React, { useState, useContext } from "react";
import InformationUpdate from "./_components/InformationUpdate";
import PasswordUpdate from "./_components/PasswordUpdate";
import SettingsAlert from "./_components/SettingsAlert";
import { AppContext } from "../../context/AppContext";

import { useHistory } from "react-router-dom";

function AccountSettings() {
  const history = useHistory();

  const { ApiServices, user, setUser } = useContext(AppContext);
  const { userService } = ApiServices;

  const [passwordUpdate, setPasswordUpdate] = useState({
    courantPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  const [accountInformations, setAccountInformations] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const [isInformationUpdated, setIsInformationUpdated] = useState(false);
  const [isPasswordNotConfirmed, setIsPasswordNotConfirmed] = useState(false);
  const [isError, setIsError] = useState(false);

  const showInformationUpdated = () => {
    setIsInformationUpdated(true);
    setTimeout(() => {
      setIsInformationUpdated(false);
    }, 1000);
  };

  const showError = () => {
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 1000);
  };

  const showPasswordNotConfirmed = () => {
    setIsPasswordNotConfirmed(true);
    setTimeout(() => {
      setIsPasswordNotConfirmed(false);
    }, 1000);
  };

  const updateAccountInformations = () => {
    userService
      .updateUser({ ...accountInformations, _id: user._id })
      .then((response) => {
        if (response.data.ok) {
          setUser({
            ...user,
            ...accountInformations,
            hasConfirmed: true,
          });
          showInformationUpdated();
        }
      })
      .catch((error) => {
        showError();
      });
  };

  const updatePassword = () => {
    const {
      courantPassword,
      newPassword,
      confirmedNewPassword,
    } = passwordUpdate;

    if (newPassword !== confirmedNewPassword) {
      showPasswordNotConfirmed();
      return;
    }
    userService
      .updatePassword(user._id, { password: newPassword })
      .then((response) => {
        if (response.data.ok) {
          showInformationUpdated();
          setTimeout(() => {
            history.push("/login");
          }, 1000);
        }
      })
      .catch((error) => {
        showError();
      });
  };
  const updateProfilePicture = () => {
    const formData = new FormData();
    formData.append("file", profilePicture);
    userService
      .updateProfilePicture(formData)
      .then((response) => {
        setUser({
          ...user,
          profilePicture: response.data.profilePicture,
        });
      })
      .catch((error) => {});
  };

  return (
    <div className="row">
      {isInformationUpdated && (
        <SettingsAlert message="INFORMATION_UPDATED_MESSAGE" badge="success" />
      )}

      {!user.hasConfirmed && (
        <SettingsAlert message="HAS_NOT_CONFIRMED_MESSAGE" badge="info" />
      )}

      {isError && (
        <SettingsAlert
          message="INFORMATION_NOT_UPDATED_MESSAGE"
          badge="danger"
        />
      )}

      {isPasswordNotConfirmed && (
        <SettingsAlert
          message="PASSWORD_NOT_CONFIRMED_MESSAGE"
          badge="danger"
        />
      )}

      <InformationUpdate
        accountInformations={accountInformations}
        setAccountInformations={setAccountInformations}
        updateAccountInformations={updateAccountInformations}
        setProfilePicture={setProfilePicture}
        profilePicture={profilePicture}
        updateProfilePicture={updateProfilePicture}
      />
      <PasswordUpdate
        passwordUpdate={passwordUpdate}
        setPasswordUpdate={setPasswordUpdate}
        updatePassword={updatePassword}
      />
    </div>
  );
}

export default AccountSettings;
