/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";

import "c3/c3.css";

import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportTable from "./ReportTable";
import BudgetForm from "../components/BudgetForm";

const Report = () => {
  const [researchersStatistics, setResearchersStatistics] = useState([]);
  const [teamPublications, setTeamPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const title = "Rapport par annéee"

  const [inputs, setInputs] = useState({
    year : 2019,
    team : "SIA"
  });

  const [filter, setFilter] = useState(null);
  const [filteringOptions, setFilteringOptions] = useState(null);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [team,setTeam] =useState("");
  const [options,setOptions] =useState([]);
  const willPrint = true;
  const { user, ApiServices } = useContext(AppContext);
  const { statisticsService, userService } = ApiServices;
  const columns = [ "team","year"];
  const inputsSkeleton = [
    
      {
        name: "team",
        label: columns[0],
        type: "select",
        options:  options,
      },
      {
        name: "year",
        label: columns[1],
        type: "select",
        options: Array(2040 - 2015 + 1).fill().map((_, idx) => 2015 + idx),
      },
    ];

 
    




  
  const updateFilteringOptionsData = useCallback(async () => {
    try {

      let response = await userService.getFilteringOptions(user._id);
      if (response.data){ setFilteringOptions(response.data);
     
}
      else throw Error();
    } catch (error) {
      
    }
  }, [user._id]);

  const updateFollowedUsersData = useCallback(async () => {
    try {
      
      const response = await statisticsService.getStatistics(filter);
      if (response.data) setResearchersStatistics(response.data);
      else throw Error();
    } catch (error) {
 
    }
  }, [filter]);

 
  const setTeamPublicationByYear = useCallback(async (year) =>{
    let req={};
    setLoading(true);
    req.year=year;
    req.team_abbreviation=inputs.team
    const response = await  statisticsService.getPublicationsPerTeam(req);
    if (response.data) {
      setTeamPublications(response.data);
      setLoading(false);
    }
    else throw Error();
  })
  
  
  useEffect(() => {
    console.log(researchersStatistics);
    updateFilteringOptionsData();
    console.log("filter",filter);
    setTeamPublicationByYear(inputs.year.toString());

  }, [updateFilteringOptionsData,researchersStatistics]);

  useEffect(()=>{
    if(filteringOptions != null)
    setOptions( filteringOptions.map(option=>option.abbreviation))

  },[filteringOptions])


  useEffect(()=>{
    setTeamPublicationByYear(inputs.year.toString());
  },[filter, researchersStatistics, inputs])
  useEffect(() => {
    if (!filter) return;
    if (!isSearchActive) setIsSearchActive(true);
    updateFollowedUsersData();
    console.log("filter",filter);
    setTeam(inputs.team);
    
    console.log("filtering options"+filteringOptions.map(option=>option.abbreviation));
  }, [filter, isSearchActive, updateFollowedUsersData,inputs]);



  
  return (
    <div className="container">
      <PageHeader
        title="Imprimer rapport"

      />
      
      
        <BudgetForm
              {...{
                inputs,
                setInputs,
                inputsSkeleton,
                title,
                willPrint,
                teamPublications,
                loading
              }}
              />
        
           
       
          
        </div>
      
    
  );
};

export default Report;
