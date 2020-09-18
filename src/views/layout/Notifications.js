/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { useHistory } from "react-router-dom";

import { NotificationIcon } from "../components/icons";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Notifications = () => {
  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { notificationsService, scraperService, userService } = ApiServices;
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [followedUsers, setFollowedResearchers] = useState([]);

  const findUserNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await notificationsService.findUserNotifications(
        user._id
      );
      if (response.data) setNotifications(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les notifications",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user._id]);

  const getFollowedResearchers = useCallback(async () => {
    try {
      const filter =
        user.roles.includes("LABORATORY_HEAD") 
          ? { laboratory_abbreviation: user.laboratoriesHeaded[0].abbreviation }
          : user.roles.includes("TEAM_HEAD")
          ? { team_abbreviation: user.teamsHeaded[0].abbreviation }
          : {};
      const response = await userService.getFollowedUsers(filter);
      if (response.status === 200 && response.data)
        setFollowedResearchers(response.data);
      else throw Error();
    } catch (error) {
      setIsLoading(false);
      pushAlert({
        message:
          "Incapable  to get the followed researchers for notifications services",
      });
    }
  }, []);

  const checkFollowedResearcher = useCallback(
    async (followedUser, index) => {
      console.log(
        "Checking new publication of :",
        followedUser.firstName,
        followedUser.lastName
      );

      try {
        const response = await scraperService.getAuthorData(
          followedUser.platform,
          followedUser.authorId
        );

        if (!response.data.author) throw new Error();

        const scrapedPublications = response.data.author.publications;

        console.log("scrapedPublications : ", scrapedPublications.length);

        const storedPublicationsTitles = followedUser.publications.map(
          ({ title }) => title
        );

        console.log(
          "storedPublicationsTitles : ",
          storedPublicationsTitles.length
        );

        const newPublications = scrapedPublications.filter(
          ({ title }) => !storedPublicationsTitles.includes(title)
        );

        console.log(
          "%cNew publications of %s",
          "color: #8a6d3b;background-color: #fcf8e3;",
          `${followedUser.firstName} ${followedUser.lastName} : ${newPublications.length}`
        );

        const responses = await Promise.all(
          newPublications.map(
            async (publication) =>
              await notificationsService.notifyFolloweers({
                authorId: followedUser.authorId,
                author_user_id: followedUser.user_id,
                publication,
                followedUserId: followedUser.user_id,
              })
          )
        );
      } catch (error) {
        pushAlert({
          message:
            "Incapable  to check if a followed researcher have new publication",
        });
      } finally {
        if (followedUsers.length === index + 1) {
          findUserNotifications();
        }
      }
    },
    [followedUsers.length]
  );

  const checkAllFollowedResearcher = useCallback(() => {
    if (followedUsers.length === 0) return;
    followedUsers.forEach((followedUser, index) => {
      setTimeout(async () => {
        checkFollowedResearcher(followedUser, index);
      }, 10000 * index);
    });
  }, [checkFollowedResearcher, followedUsers]);

  useEffect(() => {
    findUserNotifications();
    getFollowedResearchers();
  }, []);

  useEffect(() => {
    if (!followedUsers || followedUsers.length === 0) return;
    checkAllFollowedResearcher();
  }, [followedUsers]);

  const markAsRead = useCallback(
    (notification) => async () => {
      console.log("userService.markNotificationAsRead");

      try {
        const response = await notificationsService.markNotificationAsRead(
          notification._id
        );
        console.log("response.data", response.data);
        if (response.data) {
          pushAlert({
            type: "success",
            message: "notification is read",
          });
          findUserNotifications();
        } else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable  of setting notification as read",
        });
      }
    },
    []
  );

  return (
    <Fragment>
      <a
        href="/#"
        className="nav-link"
        data-toggle={notifications.length > 0 ? "dropdown" : ""}
      >
        {!isLoading && <NotificationIcon />}
        {isLoading && <Loader size={25} />}
        {!isLoading && (
          <span href="/#" className="badge bg-red">
            {notifications.length}
          </span>
        )}
      </a>

      <div
        style={{ width: "300px" }}
        className="dropdown-menu dropdown-menu-right dropdown-menu-arrow dropdown-menu-card"
      >
        <div className="card p-1">
          {notifications.map((notification, index) => (
            <Notification
              key={index}
              notification={notification}
              markAsRead={markAsRead(notification)}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
};
export default Notifications;

const Notification = ({ notification, markAsRead }) => {
  const history = useHistory();

  const { alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  return (
    <div
      className="toast show"
      roles="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-autohide="false"
      data-toggle="toast"
    >
      <Link
        onClick={(e) => {
          e.preventDefault();
          history.push("/profile/" + notification.author_user_id);
          pushAlert({
            type: "info",
            autoClose: false,
            message: "Nouvelle publication : " + notification.publication,
          });
          markAsRead();
        }}
      >
        <div className="toast-header">
          {notification.profilePicture && (
            <span
              className="avatar avatar-sm mr-2"
              style={{
                backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}/pictures/${notification.profilePicture})`,
              }}
            ></span>
          )}

          <strong className="mr-auto">{notification.fullName}</strong>
        </div>
        <div className="toast-body">
          {`${notification.fullName} a publié une nouvelle publication intitulé : "${notification.publication}"`}
        </div>
      </Link>
    </div>
  );
};
