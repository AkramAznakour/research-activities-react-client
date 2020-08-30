/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    Fragment,
    useEffect,
    useState,
    useContext,
    useCallback,
  } from "react";
  import { AppContext } from "../../../context/AppContext";
  import CRUDTable from "../../components/CRUDTable";
  import PageHeader from "../../components/PageHeader";
  import { useHistory } from "react-router-dom";
  
  const Laboratories = () => {
    const history = useHistory();
  
    const { ApiServices, alertService } = useContext(AppContext);
    const { user } = useContext(AppContext);
    const { pushAlert } = alertService;
    const { laboratoryService, establishmentService } = ApiServices;
  
    const [laboratories, setLaboratories] = useState([]);
    const [establishments, setEstablishments] = useState([]);
  
  
    const columns = ["Nom", "Abréviation", "Établissement"];
  
    const inputsSkeleton = [
      { name: "name", label: columns[0], type: "input" },
      { name: "abbreviation", label: columns[1], type: "input" },
      {
        name: "establishment",
        label: columns[2],
        type: "select",
        options: establishments,
      },
    ];
  
  
    const updateLaboratoryData = useCallback(async () => {
      try {
        const response = await laboratoryService.getLaboratoriesOfDirector(user._id);
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
  
  
    useEffect(() => {
      updateLaboratoryData();
    }, [ updateLaboratoryData]);
  
    
    const manageLaboratory = ({ _id }) => {
      console.log("manage directory");
      history.push(`/laboratory/${_id}`);
    };
  
    return (
      <Fragment>
        <div className="page-header">
          <PageHeader
            title="Laboratoires"
            subTitle={`${laboratories.length} laboratoire(s)`}
          />
        </div>
        <div className="row row-cards row-deck">
          <div className="col-md-8">
            <CRUDTable
              columns={columns}
              data={laboratories}
              tableSkeleton={inputsSkeleton}
              actions={[
                { name: "Voir", function: manageLaboratory, style: "primary" },
              ]}
            />
          </div>
        </div>
      </Fragment>
    );
  };
  
  export default Laboratories;
  