/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import Loader from "../../components/Loader";

const Publication = ({
  author,
  publication,
  updatePublication,
  index,
  platform,
}) => {
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService } = ApiServices;

  const [noResultFound, setNoResultFound] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getJournalData = async () => {
    try {
      setIsLoading(true);

      const jouranlName = publication.source
        ? publication.source
        : publication.extraInformation &&
          publication.extraInformation["Journal"]
        ? publication.extraInformation["Journal"]
        : null;

      console.log("jouranlName : ", jouranlName);

      if (!jouranlName) {
        updatePublication(index, {
          ...publication,
          searchedFor: true,
        });
        return;
      }
      const jouranlNameQuery = jouranlName.replace("/", "").replace("\\", "");

      const response = await scraperService.getJournalData(
        jouranlNameQuery,
        publication.year
      );
      if (response.data.error || response.data.status === 404) {
        setNoResultFound(true);
        updatePublication(index, {
          ...publication,
          searchedFor: true,
        });
      } else {
        setIsFetched(true);
        updatePublication(index, {
          ...publication,
          IF: response.data.journal["IF"],
          SJR: response.data.journal["SJR"],
          searchedFor: true,
        });
      }
    } catch (e) {
      pushAlert({
        message:
          "Incapable d'obtenir les données de la publication" +
          publication.title,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!publication.IF && !publication.SJR && !publication.searchedFor)
      setTimeout(() => {
        if (isMounted) getJournalData();
      }, index * 60000);

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchedButton = (
    <button
      className="btn  btn-sm m-3 btn-outline-secondary "
      onClick={getJournalData}
    >
      récupérer
    </button>
  );
  return (
    <tr style={{ whiteSpace: "break-spaces " }} key={publication.title}>
      <td style={{ width: "60%" }}>
        {publication.title}
        {publication.authors && (
          <small
            style={{ whiteSpace: "break-spaces " }}
            className="d-block text-muted text-truncate mt-n1"
          >
            {publication.authors.join(", ")}
          </small>
        )}

        {publication.source && (
          <small
            style={{ whiteSpace: "break-spaces " }}
            className="d-block text-muted text-truncate mt-n1"
          >
            {publication.source}
          </small>
        )}

        {publication.extraInformation &&
          publication.extraInformation["Conference"] && (
            <small
              style={{ whiteSpace: "break-spaces " }}
              className="d-block text-muted text-truncate mt-n1"
            >
              {publication.extraInformation["Conference"]}
            </small>
          )}

        {publication.extraInformation &&
          publication.extraInformation["Journal"] && (
            <small
              style={{ whiteSpace: "break-spaces " }}
              className="d-block text-muted text-truncate mt-n1"
            >
              {publication.extraInformation["Journal"]}
            </small>
          )}
      </td>
      <td className="text-center">{publication.year ?? ""}</td>
      <td className="text-center">
        {publication.citation ? publication.citation.replace("*", "") : ""}
      </td>
      <td className="text-center">
        {publication.IF ?? " "}
        {isLoading && <Loader size="25" />}
      </td>
      <td className="text-center">
        {publication.SJR ?? " "}
        {isLoading && <Loader size="25" />}
      </td>
      <td className="text-center">
        {noResultFound && " "}
        {!isFetched && !publication.searchedFor && !isLoading && fetchedButton}
      </td>
    </tr>
  );
};

export default Publication;
