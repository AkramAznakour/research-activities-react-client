import React, { Fragment, useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import CRUDTable from "../../_common/_components/CRUDTable";
import CRUDForm from "../../_common/_components/CRUDForm";
import PageHeader from "../../_common/_components/PageHeader";

const Teams = (props) => {
  const { user, ApiServices, UserHelper } = useContext(AppContext);
  const { teamService } = ApiServices;

  const [teams, setTeams] = useState([]);
  const [laboratories, setLaboratories] = useState([]);

  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = ["Nom", "Abréviation", "laboratoire"];

  const inputsSkeleton = [
    { name: "name", label: columns[0], type: "input" },
    { name: "abbreviation", label: columns[1], type: "input" },
    {
      name: "laboratory",
      label: columns[2],
      type: "select",
      options: laboratories,
    },
  ];

  const clearInputs = () => {
    setInputs((inputs) => ({
      name: "",
      abbreviation: "",
      laboratory_id: "",
    }));
  };


  const updateTeamData = useCallback(() => {
    teamService.findAllTeams().then((response) => {
      const filteredLaboratoiresIds = user.laboratoriesHeaded.map(
        ({ _id }) => _id
      );
      const filteredTeams = response.data
        .filter(
          (team) => filteredLaboratoiresIds.indexOf(team.laboratory_id) !== -1
        )
        .map((team) => ({
          ...team,
          laboratory: team.laboratory.name,
        }));
      setTeams(filteredTeams);
    });
  },[teamService, user.laboratoriesHeaded]);

  const updateLaboratoriesData = useCallback(() => {
    setLaboratories(user.laboratoriesHeaded);
  },[user.laboratoriesHeaded]);

  const editTeam = (team) => {
    setAction("EDITING");
    setInputs((inputs) => ({
      ...inputs,
      ...team,
    }));
  };

  const addTeam = () => {
    teamService.createTeam(inputs).then((response) => {
      updateTeamData();
      clearInputs();
    });
  };

  const updateTeam = (team) => {
    teamService
      .updateTeam({
        ...team,
        ...inputs,
      })
      .then((response) => {
        setAction("ADDING");
        updateTeamData();
        clearInputs();
      });
  };

  const deleteTeam = (team) => {
    teamService.deleteTeam(team._id).then((response) => {
      updateTeamData();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    return action === "ADDING"
      ? addTeam()
      : action === "EDITING"
      ? updateTeam()
      : updateTeamData();
  };

  const cancelEdit = () => {
    clearInputs();
    setAction("ADDING");
  };

  useEffect(() => {
    updateTeamData();
    updateLaboratoriesData();
    clearInputs();
  }, [updateLaboratoriesData, updateTeamData]);

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader
          title={`Équipes de votre laboratoire ${UserHelper.userHeadedLaboratories(
            user
          )}`}
          subTitle={`${teams.length} équipe(s)`}
        />
      </div>
      <div className="row row-cards row-deck">
        <div className="col-md-8">
          <CRUDTable
            columns={columns}
            data={teams}
            tableSkeleton={inputsSkeleton}
            actions={[
              { name: "Modifier", function: editTeam, style: "primary" },
              {
                name: "Supprimer",
                function: deleteTeam,
                style: "danger",
              },
            ]}
          />
        </div>
        <div className="col-md-4">
          <CRUDForm
            {...{
              inputs,
              setInputs,
              inputsSkeleton,
              handleSubmit,
              cancelEdit,
              action,
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Teams;
