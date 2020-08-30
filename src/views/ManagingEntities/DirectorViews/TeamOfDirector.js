/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";

import { AppContext } from "../../../context/AppContext";
import PageHeader from "../../components/PageHeader";
import UserListItem from "../../Author/components/UserListItem";
import Loader from "../../components/Loader";
import { useParams, Link } from "react-router-dom";
import UserPicture from "../../components/UserPicture";

const Team = () => {
  const { teamId } = useParams();
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService, teamService } = ApiServices;

  const [researchers, setResearchers] = useState([]);
  const [team, setTeam] = useState(null);

  const updateData = useCallback(async () => {

    try {
      const response = await userService.getResearchers();
      if (response.data) setResearchers(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données des chercheurs" });
    }
    try {
      let response = await teamService.findTeam(teamId);
      if (response.data) setTeam(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de l'équipe" });
    }
  }, []);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const addToTeam = (team_id) => async (user_id) => {
    try {
      let response = await teamService.addUserToTeam(team_id, user_id);
      if (response.data) updateData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'ajouter le membre à l'équipe" });
    }
  };

  const removeFromTeam = (team_id) => async (user_id) => {
    try {
      let response = await teamService.removeFromTeam(team_id, user_id);
      if (response.data) updateData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de retirer le membre de l'équipe" });
    }
  };

  const makeAsTeamHead = (team_id) => async (user_id) => {
    try {
      let response = await teamService.associateHeadToTeam(team_id, user_id);
      if (response.data) updateData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'associer le chef à l'équipe" });
    }
  };

  return (
    <div className="container">
      <PageHeader
        title={team ? `Equipe ${team.abbreviation}` : ""}
        subTitle={team ? team.name : ""}
      />
      {team == null && <Loader size="60" />}
      <div className="row">
        <div className="col-md-8">
          {team != null && (
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 p-2 d-flex align-items-center">
                    <span className="bg-blue text-white stamp mr-1 p-1">
                      {team.university.abbreviation}
                    </span>
                    <div className=" lh-sm">
                      <div className="strong">{team.university.name}</div>
                      <div className="text-muted">{team.university.city}</div>
                    </div>
                  </div>

                  <div className="col-md-4  p-2 d-flex align-items-center">
                    <span className="bg-blue text-white stamp mr-1 p-1">
                      {team.laboratory.abbreviation}
                    </span>
                    <div className=" lh-sm">
                      <div className="strong">{team.laboratory.name}</div>
                      <div className="text-muted">
                        {team.establishment.abbreviation}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4  p-2 d-flex align-items-center">
                    <span className="bg-blue text-white stamp mr-1 p-1">
                      {team.abbreviation}
                    </span>
                    <div className=" lh-sm">
                      <div className="strong">{team.name}</div>
                      <div className="text-muted">
                        {team.establishment.abbreviation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {team != null && (
            <TeamBox
              addToTeam={addToTeam(team._id)}
              removeFromTeam={removeFromTeam(team._id)}
              makeAsTeamHead={makeAsTeamHead(team._id)}
              team={team}
              researchers={researchers}
            />
          )}
        </div>

        <div className="col-md-4">
          {team != null && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Chef d'équipe</h3>
              </div>
              <div className="card-body p-0">
                <div className="list list-row list-hoverable">
                  {team.teamHead != null && (
                    <UserListItem
                      user={team.teamHead}
                      subTitle={`Chef d'équipe ${team.abbreviation}`}
                    />
                  )}
                  {team.teamHead == null && (
                    <div className="list-item ">
                      <small className=" text-center  text-muted text-truncate mt-n1">
                        Pas encore désigné
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {team != null &&
            team.head_history != null &&
            team.head_history.length > 0 && (
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title">Historique</h3>
                </div>
                <div className="card-body p-0">
                  <div
                    style={{ maxHeight: "300px" }}
                    className="list overflow-auto list-row list-hoverable"
                  >
                    {team.head_history
                      .slice(0)
                      .reverse()
                      .map(({ head, start, end }) => (
                        <UserListItem
                          user={head}
                          subTitle={`Chef depuis ${start}  ${
                            end ? "vers " + end : ""
                          }`}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Team;

const TeamBox = ({
  researchers,
  team,
  addToTeam,
  removeFromTeam,
  makeAsTeamHead,
}) => {
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const { user, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;

  const handleSelectedResearcherChange = (event) => {
    event.persist();
    setSelectedResearcher(event.target.value);
  };

  const handSubmit = (event) => {
    event.preventDefault();
    addToTeam(selectedResearcher);
  };
  return (
    <div className="card">
      <div className="card-header d-block">
        <h3 className="card-title ">Membres</h3>
        <div className=" text-muted m-0">{team.members.length} Chercheurs</div>
      </div>
      {team.members.length > 0 && (
        <div className="card-body">
          <div className="row mb-n3">
            {team.members.map((member, index) => (
              <div
                key={index}
                className="col-6 row row-sm mb-3 align-items-center"
              >
                <UserPicture user={member} />
                <div className="col text-truncate">
                  <Link
                    to={`/profile/${member._id}`}
                    className="text-body d-block text-truncate"
                  >
                    {`${member.firstName} ${member.lastName}`}
                  </Link>

                  <small className="d-block text-muted text-truncate mt-n1">
                
                    {team.head_id === member._id && (
                      <span className="badge bg-primary">Chef d'équipe</span>
                    )}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};
