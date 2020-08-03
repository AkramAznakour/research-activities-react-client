/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  Fragment,
} from "react";

import { useParams } from "react-router-dom";

import AuthorHeader from "./components/AuthorHeader";
import Coauthors from "./components/Coauthors";
import AuthorCitations from "./components/AuthorCitations";
import Publications from "./components/Publications";

import { AppContext } from "../../context/AppContext";
import NoResultFound from "../components/NoResultFound";
import Loader from "../components/Loader";
import LoadingResult from "../components/LoadingResult";

const Author = () => {
  const { scholarId } = useParams();
  const [author, setAuthor] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isSendingFollow, setsSendingFollow] = useState(false);
  const [users, setUsers] = useState([]);
  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService, userService } = ApiServices;

  const getAuthorData = useCallback(async () => {
    try {
      setAuthor();
      setIsLoading(true);
      if (isError) setIsError(false);
      if (noResultFound) setNoResultFound(false);

      const response = await scraperService.getAuthorData(scholarId);
      if (response.data.error) throw Error(response);
      if (response.status === 200) setAuthor(response.data);
    } catch (error) {
      setIsError(true);
      setNoResultFound(true);
      pushAlert({ message: "Incapable d'obtenir les données de l'auteur" });
    } finally {
      setIsLoading(false);
    }
  }, [scholarId]);

  const getIfIsFollowing = useCallback(async () => {
    try {
      const response = await userService.isFollowing(scholarId);
      if (response.data.isFollowing) setIsFollowed(true);
      throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir si l'auteur est suivi" });
    }
  }, [scholarId]);

  const findAllUsers = useCallback(async () => {
    try {
      const response = await userService.findAllUsers();
      setUsers(response.data);
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir des utilisateurs" });
    }
  }, []);

  const toggleFollow = useCallback(
    async (user_id) => {
      try {
        const service = isFollowed
          ? userService.unfollowUser(scholarId)
          : userService.followUser({ ...author, user_id });

        setsSendingFollow(true);
        await service;
        setIsFollowed(!isFollowed);
      } catch (error) {
        pushAlert({ message: "Incapable de basculer le suivi" });
      } finally {
        setsSendingFollow(false);
      }
    },
    [scholarId]
  );

  useEffect(() => {
    getAuthorData();
    if (user.role === "LABORATORY_HEAD") {
      getIfIsFollowing();
      findAllUsers();
    }
  }, []);

  return (
    <div className="row">
      {isLoading && <LoadingResult />}
      {noResultFound && <NoResultFound query={scholarId} />}
      {author && (
        <Fragment>
          <div className="col-lg-8">
            <AuthorHeader
              isUpdating={isUpdating}
              users={users}
              user={user}
              author={author}
              toggleFollow={toggleFollow}
              isFollowed={isFollowed}
              isSendingFollow={isSendingFollow}
            />
            <Publications author={author} setAuthor={setAuthor} />
          </div>
          <div className="col-lg-4">
            <AuthorCitations author={author} />
            <Coauthors author={author} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Author;
