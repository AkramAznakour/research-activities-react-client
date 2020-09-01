import React from "react";
import NoResultFound from "../../components/NoResultFound";

const BudgetTable = ({ labBudget }) => {
 
  
  if(labBudget !== undefined)
  {return (
    <table className="table card-table table-vcenter">
      <thead>
        <tr>
          <th>Année</th>
          <th>Budget</th>
          <th>Details</th>
    </tr>
      </thead>
  <tbody>    
          {Object.keys(labBudget).reverse().map((year,index) => (

            <tr key={index}>
             <td> {year}</td>
            <td className="" key={index}>{labBudget[year] ?? 0}DH</td>
            <td> <button type="button" class="btn btn-primary ">détails</button> </td>
            </tr>
          ))
          }
      </tbody>
    </table>
  );}
  else {
    return ( <NoResultFound query={""}  />
      )
  }
};

export default BudgetTable;
