
import React, {
    Fragment,
    useEffect,
    useState,
    useContext,
    useCallback,
  } from "react";

import { AppContext } from "../../context/AppContext";
import PageHeader from "../components/PageHeader";
import BudgetForm from "../components/BudgetForm";
import C3Chart from "react-c3js";
import BudgetTable from "../Statistics/components/BudgetTable";

  const LaboratoryBudget = () => {
  
    const { ApiServices, alertService, user, UserHelper } = useContext(AppContext);
    const { pushAlert } = alertService;
    const { laboratoryService, userService   } = ApiServices;
  
    const [laboratories, setLaboratories] = useState([{title : "t"}]);
  
    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");
    const [chartVersion, setChartVersion] = useState(0);

    const [chart, setChart] = useState({
      data: {
        unload: true,
        x: "x",
        type: "line",
        columns: [],
      },
    });
    const columns = [ "budget", "year"];
    const [dateRange, setDateRange] = useState({
      start: 2015,
      end:new Date().getFullYear()+1,
    });
  
    const title = "Ajouter budget de l'année prochaine";

    const inputsSkeleton = [
      { name: "budget", label: columns[0], type: "input" },
      {
        name: "year",
        label: columns[1],
        type: "select",
        options: Array(2040 - 2015 + 1).fill().map((_, idx) => 2015 + idx),
      },
    ];
  
    const clearInputs = () => {
      setInputs((inputs) => ({

        budget: "",
        
      }));
    };
    const updateLaboratoriesData = useCallback(async () => {
      let response = await laboratoryService.findAllLaboratories();
      let newlabs =[];
          if(response.data){
          response.data.map((laboratory) => {
       
            if(laboratory.name === user.laboratoriesHeaded[0].name){
             newlabs.push(laboratory);
            
              setLaboratories(newlabs);
              console.log(laboratories);
            }
          })}
      ;
    }, [laboratoryService]);
  

       
  
       
    const updateLaboratoryData = useCallback(() => {
      setLaboratories(user.laboratoriesHeaded);
    }, [user.laboratoriesHeaded]);
  

    const updateChart = useCallback(() => {
      let budget ={2015 : 0}
      if(laboratories[0].budget!== undefined)
      {budget = laboratories[0].budget;}
     

  
      const columns = [["budget"].concat(Object.keys(budget).map((year) =>budget[year] ?? 0))]
      .concat([["x"].concat(Object.keys(budget))]);
      setChart(() => ({
        data: {
          x: "x",
          type: "line",
          columns,
        }
      }))
      setChartVersion(chartVersion+1);
    },[laboratories]);
  
    
   
   
  
    const updateLaboratory = async (laboratory) => {
      let year = new Date().getFullYear()+1;

     console.log(year);
     console.log(inputs.budget);
     console.log(inputs.year);
     let lab= laboratory;
     console.log(lab);
     if(laboratory.budget === undefined)lab.budget={};
     
     
     lab.budget[inputs.year]=parseInt(inputs.budget);
     
      try {
        const response = await laboratoryService.updateLaboratory(
         lab,
         
        );

  
        if (response.data) {
          setAction("ADDING");
          updateLaboratoriesData();
          clearInputs();
        } else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable de mettre à jour les données de laboratoire",
        });
      }
    };
  

    useEffect(() => {
      if(laboratories.length !==0){
      
      clearInputs();
      updateChart();
      }
    }, [ updateLaboratoriesData, updateChart]);
  
    useEffect(() => {
      updateChart();
    }, [ laboratories ]);

    useEffect(() => {
     
      
        updateLaboratoriesData();
      
    }, []);
  
    const handleSubmit = (event) => {
      event.preventDefault();

      console.log(
       
        laboratories[0],
      
      );
      
      updateLaboratory(laboratories[0]);

      updateLaboratoriesData();

    };
  
    const cancelEdit = () => {
      clearInputs();
      setAction("ADDING");
    };
  
    return (
      <Fragment>
        <div className="page-header">
          <PageHeader
           title={`Budget de votre laboratoire ${UserHelper.userHeadedLaboratories(
            user
          )}`}
            /*subTitle={` Budget de lannée prochaine : ${laboratories[0].budget[new Date().getFullYear()+1]===undefined? 0:laboratories[0].budget[new Date().getFullYear()+1]} DH`}*/
          />
        </div>
        
        <div >
         {laboratories.length !==0 &&
            <BudgetForm
              {...{
                inputs,
                setInputs,
                inputsSkeleton,
                handleSubmit,
                cancelEdit,
                action,
                title
              }}
            />}
          </div>
      
          <br/>
          <div className="row">
          <div className="col-md-5">
          <div className="table-responsive">
          <div className="card">    
          {(laboratories.length !==0)&& <BudgetTable
                  labBudget={laboratories[0].budget}
                 
                />
          }
              </div>   
            </div> 
            </div>
            <div className="col-md-7">
        <div className="card">        
              <div
                id="apexchartDatas28b504"
                className="apexchartDatas-canvas apexchartDatas28b504 apexchartDatas-theme-light"
              >
          {(laboratories.length !==0 && laboratories[0].budget!== undefined)&&
                  <C3Chart
                   key={chartVersion}
                   data={chart.data}
                   unloadBeforeLoad={true}
                  title={{
                    text: "Budget par année",
                        }}
                  legend={{
         
                   show: true,
                        }}
                      />}
                
                </div>
              </div>
            </div>
            </div>

      </Fragment>
    );
  };
  
  export default LaboratoryBudget;
  