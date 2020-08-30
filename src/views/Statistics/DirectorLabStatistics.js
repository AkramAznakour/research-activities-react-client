/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import StatisticsTable from "./components/StatisticsTable";
import { AppContext } from "../../context/AppContext";
import StatisticsFilter from "./components/StatisticsFilter";

import C3Chart from "react-c3js";
import "c3/c3.css";
import LabFilter from "../components/LabFilter";
import ResearchersFilter from "../components/ResearchersFilter";
import { Link } from "react-router-dom";
import NoResultFound from "../components/NoResultFound";

const LabStatistics = () => {
  const [researchersStatistics, setResearchersStatistics] = useState([]);
  const [labsStatistics, setLabsStatistics] = useState([]);

   const [selectedLabs, setSelectedLabs] = useState([]);
  const [
    filteredResearchersStatistics,
    setFilteredResearchersStatistics,
  ] = useState([]);

  const [dateRange, setDateRange] = useState({
    start: 2010,
    end: new Date().getFullYear(),
  });

  const [filter, setFilter] = useState(null);
  const [filteringOptions, setFilteringOptions] = useState(null);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, ApiServices } = useContext(AppContext);
  const { statisticsService, userService, laboratoryService, establishmentService } = ApiServices;
  const [laboratories, setLaboratories] = useState([]);
  const [establishments, setEstablishments] = useState([]);

  const [columns, setColumns] = useState([]);
  const [currentLab, setCurrentLab] = useState(null);

  const [chartVersion, setChartVersion] = useState(0);
  const [chart, setChart] = useState({
    data: {
      unload: true,
      x: "x",
      type: "line",
      columns: [],
    },
  });

 
  const getLabData = useCallback(async (lab) =>{
    setResearchersStatistics([]);
    Promise.all(lab.teams.map(
      (async (team)=>{
        const response = await statisticsService.getStatistics({[`team_abbreviation`]: team.abbreviation});
      if (response.data)  setResearchersStatistics(researcherStatistics => researcherStatistics.concat(response.data));
      else throw Error();
     
 
    
      })
    ))
  },[statisticsService])
  
    const deleteLab = (abbreviation)=> {  
      console.log("deleting");
      for(let i in labsStatistics){
        if(labsStatistics[i].lab === abbreviation){
          if(i===0){
            console.log(i);
            labsStatistics.shift();
          }
          console.log(i);
          labsStatistics.splice(i , 1);
          
        }
      }    
    }
  

    const updateEstablishmentData = useCallback(async () => {

      let response = await establishmentService.getEstablishmentOfDirector(user._id);
      setEstablishments(
          response.data.map((establishment) => ({
            ...establishment,
           
          }))
      );
    }, [establishmentService]);
  

  


  const updateLaboratoryData = useCallback(async () => {
    let response = await laboratoryService.findAllLaboratories();
    setLaboratories(
        response.data.map((laboratory) => ({
          ...laboratory,
          establishment: laboratory.establishment.name,
        }))
    );
  }, [laboratoryService]);

  const updateLabsStatistics = useCallback (async() =>{
    let yearsRange = [];
    let teamStats= {};
    console.log("in lab");

    for (let i = dateRange.start; i <= dateRange.end; i++){ yearsRange.push(i); teamStats[i]=0};   

    researchersStatistics
    .map((usersStatistic) =>
    
     {if(usersStatistic != null)
      { yearsRange.map((year)=>{
       
        teamStats[year]=teamStats[year]+(usersStatistic.yearlyPublications[year] ?? 0)
       })
       
    ;}
   
    }
       
    
    );
   
      console.log(teamStats);
      console.log(currentLab);
    
        console.log("heere");
        if(currentLab!== null )
        
        {
          deleteLab(currentLab.abbreviation);
        }
        
        if(labsStatistics.length <=selectedLabs.length && selectedLabs.length>0)

      {
        console.log("adding to selected labs");
        console.log(teamStats);
        setLabsStatistics( teamsStatistics=> teamsStatistics.concat({
        'lab': selectedLabs[selectedLabs.length-1].abbreviation,
        'publications': teamStats
      })
       );}
    
 
  });

  const updateChart =(async() => {
    let yearsRange = [];
    let teamStats= {};
    console.log("in chart");
    for (let i = dateRange.start; i <= dateRange.end; i++){ yearsRange.push(i); teamStats[i]=0};   
  
    const columns =   
    labsStatistics
      .map((labStatistics) =>
      
        [labStatistics.lab].concat(
          yearsRange.map((year) =>  labStatistics.publications[year] ?? 0)
        ) 
      )    
      .concat([["x"].concat(yearsRange)]);

    setChart(() => ({
     
      data:{
      x: "x",
        columns,
        type: 'line',
      
      
    }}));
    console.log(columns);
    setChartVersion(chartVersion + 1);
  
  });
  



  const updateStatistics = () => {}; 

  useEffect(() => {
    updateLaboratoryData(); 
   
  }, [user]);

  useEffect(() => {
   
    updateEstablishmentData();
   
  }, [user]);

  useEffect( () => {if (selectedLabs.length !== 0){
    getLabData( currentLab);
    console.log("currentLab");
   console.log(currentLab);
 }
 }, [ selectedLabs]);

  useEffect( () => {
     
    updateLabsStatistics();
   
  
  }, [researchersStatistics, selectedLabs]);
 


  useEffect(() => { 
   
    updateChart();
    }, [selectedLabs,JSON.stringify(researchersStatistics),JSON.stringify(labsStatistics)]);

    useEffect(() => { 
      console.log(labsStatistics)
     }, [labsStatistics])

  useEffect(() => {
    if (selectedLabs != null){
    updateChart();
  
    }
  },[dateRange.end,
    dateRange.start,JSON.stringify(labsStatistics)])

    useEffect(() => { 
      console.log(selectedLabs);
      updateLabsStatistics();

     }, [selectedLabs])
 

  

  return (
    <div className="container">
      
      <div className="row">
        <div className="col-md-4">

          <StatisticsFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            updateStatistics={updateStatistics}
          />
         
          <LabFilter {... {laboratories, establishments, selectedLabs, setSelectedLabs, currentLab, setCurrentLab}}/>
        </div>
          <div className="col-md-8">
          <div className="card">
            <div id="chartData-development-activity" className="mt-4">
              <div
                id="apexchartDatas28b504"
                className="apexchartDatas-canvas apexchartDatas28b504 apexchartDatas-theme-light"
              >
                 {labsStatistics.length > 0 && (
                  <C3Chart
                    key={chartVersion}
                    data={chart.data}
                    unloadBeforeLoad={true}
                    title={{
                      text: "Nombre des publications par année",
                    }}
                    legend={{
                      show: true,
                    }}
                  />
                 )}
                {labsStatistics.length === 0 && (
                  <NoResultFound query={searchTerm} />
                )}
              </div>
            </div>
          

        </div>
      </div>
        </div>
        </div>
     
   
  );
};


export default LabStatistics;
