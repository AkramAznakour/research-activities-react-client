/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AppContext } from "../../context/AppContext";
import CRUDTable from "../components/CRUDTable";
import CRUDForm from "../components/CRUDForm";
import PageHeader from "../components/PageHeader";
import { useHistory } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PhdStudentsReport from "./PhdStudentsReport";
import { CrossIcon } from "../components/icons";

const PhdPage = () => {
  const history = useHistory();
  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const {
    phdStudentService,
    userService,
    establishmentService,
    laboratoryService,
  } = ApiServices;
  const [phdStudents, setPhdStudents] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [establishments, setEstablishments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [coSupervisors, setCoSupervisors] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [printOptions, setPrintOptions] = useState({});
  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = [
    "Directeur de thèse",
    "Co-Directeur de thèse",
    "Nom de doctorant",
    "Prénom de doctorant",
    "Intitulé de la Thèse",
    "Cotutelle (CT) - Codirection (CD) ",
    "Année de 1 ère inscription",
    "Date de soutenance",
  ];

  const inputsSkeleton = [
    {
      name: "supervisor",
      label: columns[0],
      type: "select",
      options: supervisors,
    },
    {
      name: "coSupervisor",
      label: columns[1],
      type: "select",
      options: coSupervisors,
    },
    { name: "lastName", label: columns[2], type: "input" },
    { name: "firstName", label: columns[3], type: "input" },
    { name: "thesisTitle", label: columns[4], type: "input" },

    { name: "cotutelle", label: columns[5], type: "radio" },
    { name: "start", label: columns[6], type: "input" },
    { name: "end", label: columns[7], type: "date" },
  ];

  const clearInputs = () => {
    setInputs(() => ({
      supervisor_id: "",
      coSupervisor_id: "",
      firstName: "",
      lastName: "",
      thesisTitle: "",
      cotutelle: false,
      start: "",
      end: "",
    }));
  };
  const updateLaboratoryData = useCallback(async () => {
    try {
      const response = await laboratoryService.findAllLaboratories();
      if (response.data)
        setLaboratories(
          response.data.map((laboratory) => ({
            ...laboratory,
            establishment: laboratory.establishment.name,
          }))
        );
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des laboratoires",
      });
    }
  }, []);

  const updateEstablishmentsData = useCallback(async () => {
    try {
      if (user.roles.includes("CED_HEAD")) {
        const response = await establishmentService.findAllEstablishments();
        if (response.data) setEstablishments(response.data);
        else throw Error();
      }
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des établissements",
      });
    }
  }, []);
  const setSupervisorsAndCoSupervisors = useCallback(async () => {
    try {
      const response = await userService.findAllUsers();
      let sup = response.data.reduce(
        (acc, researcher) =>
          acc.concat({
            _id: researcher._id,
            name: [researcher.firstName, researcher.lastName].join(" "),
          }),
        []
      );
      setCoSupervisors([{ _id: null, name: "Pas de co-directeur" }, ...sup]);
      setSupervisors(sup);
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir des utilisateurs" });
    }
  }, []);

  const updatePhdStudentData = useCallback(async () => {
    try {
      const response = await phdStudentService.findStudentsOfUser();
      const { students } = response.data;
      if (response.data.length !== 0) {
        const filteredPhdStudents = students.map((st) => ({
          ...st,
          coSupervisor:
            st.coSupervisor === null
              ? "néant"
              : [st.coSupervisor.firstName, st.coSupervisor.lastName].join(" "),
          supervisor: [st.supervisor.firstName, st.supervisor.lastName].join(
            " "
          ),
          cotutelle: st.cotutelle ? "oui" : "non",
        }));
        if (filteredPhdStudents.length === 0) {
          setIsEmpty(true);
        } else {
          setPhdStudents(filteredPhdStudents);
          setIsEmpty(false);
        }
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données des doctorants",
      });
    }
  }, [user]);

  const editPhdStudent = async (student) => {
    const response = await phdStudentService.findstudent(student._id);
    setAction("EDITING");
    let cosup;
    cosup =
      student.coSupervisor.localeCompare("néant") === 0
        ? { _id: "" }
        : response.data.coSupervisor;
    setInputs((inputs) => ({
      ...inputs,
      ...student,
      coSupervisor_id: cosup._id,
      supervisor_id: response.data.supervisor._id,
    }));
    if (!cosup._id.localeCompare(user._id)) {
      let index = supervisors.findIndex(
        (sup) => !sup.name.localeCompare(student.supervisor)
      );
      let coIndex = coSupervisors.findIndex((sup) =>
        sup.name.localeCompare(
          [cosup.firstName, response.data.coSupervisor.lastName].join(" ")
        )
      );
      coIndex === -1
        ? (document.getElementById("coSupervisor_id").selectedIndex = 0)
        : (document.getElementById("coSupervisor_id").selectedIndex = coIndex);
      document.getElementById("supervisor_id").selectedIndex = index;
      document.getElementById("coSup").checked = true;
      document.getElementById("Co-Directeur de thèse").style.visibility =
        "hidden";
      document.getElementById("Directeur de thèse").style.visibility =
        "visible";
    }
    else if (!response.data.supervisor._id.localeCompare(user._id)) {
      let coIndex = coSupervisors.findIndex(
        (sup) => !sup.name.localeCompare(student.coSupervisor)
      );

      let index = supervisors.findIndex(
        (sup) =>
          !sup.name.localeCompare(
            [
              response.data.supervisor.firstName,
              response.data.supervisor.lastName,
            ].join(" ")
          )
      );
      document.getElementById("supervisor_id").selectedIndex = index;
      coIndex === -1
        ? (document.getElementById("coSupervisor_id").selectedIndex = 0)
        : (document.getElementById("coSupervisor_id").selectedIndex = coIndex);
      document.getElementById("sup").checked = true;
      document.getElementById("Co-Directeur de thèse").style.visibility =
        "visible";
      document.getElementById("Directeur de thèse").style.visibility = "hidden";
    }
    else{
      document.getElementById("Directeur de thèse").style.visibility = "visible";
      document.getElementById("Co-Directeur de thèse").style.visibility =
      "visible";
    }
  };

  const addPhdStudent = async () => {
    try {
      if (inputs.supervisor_id !== null) {
        let student = {
          coSupervisor: inputs.coSupervisor_id,
          cotutelle: inputs.cotutelle,
          end: inputs.end,
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          start: inputs.start,
          supervisor: inputs.supervisor_id,
          thesisTitle: inputs.thesisTitle,
        };
        const response = await phdStudentService.createPhdStudent(student);
        if (response.data) {
          updatePhdStudentData();
          clearInputs();
        }
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer le doctorant" });
    }
  };

  const updatePhdStudent = async (student) => {
    try {

      let newStudent = {
        ...inputs,
        cotutelle: inputs.cotutelle.localeCompare("non") === 0 ? false : true,
        coSupervisor:
          inputs.coSupervisor_id,
        supervisor: inputs.supervisor_id,
      };

      const response = await phdStudentService.updatePhdStudent({
        ...student,
        ...newStudent,
      });
      if (response.data) {
        setAction("ADDING");
        updatePhdStudentData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données du doctorant",
      });
    }
  };

  const deletePhdStudent = async (student) => {
    try {
      const response = await phdStudentService.deletePhdStudent(student._id);
      if (response.data) updatePhdStudentData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de supprimer le doctorant" });
    }
  };

  const managePhdStudent = ({ _id }) => {
    history.push(`/phdStudent/${_id}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    return action === "ADDING"
      ? addPhdStudent()
      : action === "EDITING"
      ? updatePhdStudent()
      : updatePhdStudentData();
  };

  const cancelEdit = () => {
    clearInputs();
    setAction("ADDING");
  };
 
  useEffect(() => {
    updateLaboratoryData();
    updateEstablishmentsData();
  }, [updateEstablishmentsData, updateLaboratoryData]);

  useEffect(() => {
    setSupervisorsAndCoSupervisors();
    updatePhdStudentData();
    clearInputs();
  }, []);

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader
          title={`Vos Doctorants Monsieur ${[
            user.firstName,
            user.lastName,
          ].join(" ")}`}
          subTitle={`${phdStudents.length} doctorant(s)`}
        />
      </div>
      <div>
        <Fragment>
          <ImpressionButton />
        </Fragment>
      </div>

      <div className="row row-cards row-deck">
        {!user.roles.includes("CED_HEAD") ? (
          <div className="col-md-12">
            <CRUDForm
              {...{
                inputs,
                setInputs,
                inputsSkeleton,
                handleSubmit,
                cancelEdit,
                action,
                twoColumns: "form",
                phdForm: true,
                user: user,
              }}
            />
          </div>
        ) : (
          <div></div>
        )}
        <div className="col-md-12">
          {isEmpty ? (
            <p className="empty-title h3">Vous avez aucun(e) doctorant(e)</p>
          ) : (
            <CRUDTable
              columns={columns}
              data={phdStudents}
              tableSkeleton={inputsSkeleton}
              actions={[
                { name: "Gérer", function: managePhdStudent, style: "primary" },
                {
                  name: "Modifier",
                  function: editPhdStudent,
                  style: "primary",
                },
                {
                  name: "Supprimer",
                  function: deletePhdStudent,
                  style: "danger",
                },
              ]}
            />
          )}
        </div>
      </div>
      <div>
        <ImpressionModel
        phdStudents={phdStudents}
          user={user}
          laboratories={laboratories}
          establishments={establishments}
          setPrintOptions={setPrintOptions}
          printOptions={printOptions}
        />
      </div>
    </Fragment>
  );
};
export default PhdPage;

const ImpressionModel = ({
  printOptions,
  setPrintOptions,
  establishments,
  laboratories,
  user,
  phdStudents
}) => {
  useEffect(() => {
    if (laboratories.length) {
      setPrintOptions((options) => ({
        ...options,
        laboratory: laboratories[0]._id,
      }));
    }
    if (establishments.length) {
      setPrintOptions((options) => ({
        ...options,
        establishment: establishments[0]._id,
      }));
    }
  }, [laboratories, establishments]);
  const handleInputsChange = (event) => {
    event.persist();
    setPrintOptions((options) => ({
      ...options,
      [event.target.name]: event.target.value,
    }));
  };
  const handleTypeChange = (event) => {
    event.persist();
    if (document.getElementById("still").checked) {
      setPrintOptions((options) => ({
        ...options,
        type: 2,
      }));
    } else if (document.getElementById("done").checked) {
      setPrintOptions((options) => ({
        ...options,
        type: 1,
      }));
    } else if (document.getElementById("all").checked) {
      setPrintOptions((options) => ({
        ...options,
        type: 0,
      }));
    }
  };
  return (
    <div
      className="modal modal-blur fade show"
      id="modal-info"
      tabindex="-1"
      roles="dialog"
      style={{ display: " none", "padding-right": "17px" }}
      aria-modal="true"
    >
      <div
        className="modal-dialog modal-sm modal-dialog-centered"
        roles="document"
      >
        <div className="modal-content">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <CrossIcon />
          </button>
          <div className="modal-body text-center py-5">
            <h3>Impression</h3>
            {user.roles.includes("CED_HEAD") && (
              <div className="form-group mt-2">
                <h4>Etablissement</h4>
                <div>
                  <select
                    value={printOptions["establishment"]}
                    name="establishment"
                    className="form-select"
                    onChange={handleInputsChange}
                    id="establishment"
                  >
                    {establishments.map(({ name, _id }, index) => (
                      <option key={index} value={_id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {(user.roles.includes("CED_HEAD") ||
              user.roles.includes("RESEARCH_DIRECTOR")) && (
              <div className="form-group mt-2">
                <h4>Laboratoire</h4>
                <div>
                  <select
                    value={printOptions["laboratory"]}
                    name="laboratory"
                    className="form-select"
                    onChange={handleInputsChange}
                    id="laboratory"
                  >
                    {laboratories.map(({ name, _id }, index) => (
                      <option key={index} value={_id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-group mt-2">
              <h4>Type des doctorants</h4>
              <fieldset>
                <div class="some-class">
                  <label className="form-label">Tous les doctorants</label>
                  <input
                    type="radio"
                    className="radio"
                    onChange={handleTypeChange}
                    name="print"
                    value={0}
                    id="all"
                  />
                </div>
              </fieldset>
              <fieldset>
                <div class="some-class">
                  <label className="form-label">
                    Doctorants en cours de thèse
                  </label>
                  <input
                    type="radio"
                    className="radio"
                    onChange={handleTypeChange}
                    name="print"
                    value={1}
                    id="still"
                  />
                </div>
              </fieldset>
              <fieldset>
                <div class="some-class">
                  <label className="form-label">Doctorants soutenus</label>
                  <input
                    type="radio"
                    className="radio"
                    onChange={handleTypeChange}
                    name="print"
                    value={2}
                    id="done"
                  />
                </div>
              </fieldset>
            </div>
          </div>

          <div className="modal-footer">
            <PDFDownloadLink
              className="btn  btn-sm m-1  btn-outline-primary"
              document={
                <PhdStudentsReport printOptions={printOptions} students={phdStudents} user={user} />
              }
              fileName={`les doctorants de ${[
                user.firstName,
                user.lastName,
              ].join(" ")}.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Chargement du document..." : "Imprimer le rapport"
              }
            </PDFDownloadLink>
           
          </div>
        </div>
      </div>
    </div>
  );
};

const ImpressionButton = () => (
  <button
    href="/#"
    data-toggle="modal"
    data-target="#modal-info"
    type="button"
    className={"btn  btn-sm m-3 mr-1 btn-outline-primary"}
  >
    Impression
  </button>
);
