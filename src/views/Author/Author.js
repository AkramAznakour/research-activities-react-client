/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  Fragment,
} from "react";

import { useParams, useLocation } from "react-router-dom";

import AuthorHeader from "./components/AuthorHeader";
import Coauthors from "./components/Coauthors";
import AuthorCitations from "./components/AuthorCitations";
import Publications from "./components/Publications";

import { AppContext } from "../../context/AppContext";
import NoResultFound from "../components/NoResultFound";
import LoadingResult from "../components/LoadingResult";
import ErrorFound from "../components/ErrorFound";

const Author = (props) => {
  const { platform, authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isAllowedToFollow, setIsAllowedToFollow] = useState(false);
  const [isSendingFollow, setsSendingFollow] = useState(false);
  const [users, setUsers] = useState([]);
  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService, userService, teamService } = ApiServices;

  const getAuthorData = useCallback(async () => {
    try {
      setAuthor();
      setIsLoading(true);
      if (isError) setIsError(false);
      if (noResultFound) setNoResultFound(false);
      const response = await scraperService.getAuthorData(platform, authorId);
      if (response.data.author) {
        setAuthor(response.data.author);
        if (user) checkFollowAuthorization(response.data.author);
      } 
      else if (response.data.error) setNoResultFound(true);
      else {
        pushAlert({ message: "Incapable d'obtenir les données de l'auteur" });
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [authorId]);

  const getIfIsFollowing = useCallback(async () => {
    try {
      const response = await userService.isFollowing(authorId);
      if (response.data.isFollowing) setIsFollowed(true);

      throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir si l'auteur est suivi" });
    }
  }, [authorId]);

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
          ? userService.unfollowUser(authorId)
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
    [authorId, author]
  );

  const checkFollowAuthorization = useCallback(async (author) => {
    const trimName = (n) =>
      n.toLowerCase().replace(" ", "").replace(/[\s ,.]/gi, "");

    const possibleNames = [
      trimName(user.firstName) + trimName(user.lastName),
      trimName(user.lastName) + trimName(user.firstName),
    ];

    console.log("possibleNames");
    console.log(possibleNames);
    console.log("trimName(author.name)");
    console.log(author.name);
    if (
      possibleNames.includes(trimName(author.name)) ||
      ["LABORATORY_HEAD", "TEAM_HEAD"].some((r) => user.roles.includes(r))
    ) {
      setIsAllowedToFollow(true);
      console.log("authorized");
    }
  }, []);

  useEffect(() => {
    getAuthorData();
    if (!user) return;
    if (
      ["LABORATORY_HEAD", "TEAM_HEAD", "RESEARCHER"].some((r) =>
        user.roles.includes(r)
      )
    ) {
      getIfIsFollowing();
      findAllUsers();
    }
  }, []);


  return (
    <div className="row">
      {isLoading && <LoadingResult />}
      {noResultFound && <NoResultFound query={authorId} />}
      {isError && <ErrorFound />}
      {author && (
        <Fragment>
          <div className="col-lg-8">
            <AuthorHeader
              platform={platform}
              users={users}
              user={user}
              author={author}
              toggleFollow={toggleFollow}
              isFollowed={isFollowed}
              isSendingFollow={isSendingFollow}
              isAllowedToFollow={isAllowedToFollow}
            />
            <Publications
              platform={platform}
              author={author}
              setAuthor={setAuthor}
            />
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
