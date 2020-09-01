import React, { Fragment, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportTable from "../Statistics/ReportTable";

const BudgetForm = ({
  inputs,
  setInputs,
  inputsSkeleton,
  handleSubmit,
  cancelEdit,
  action,
  title,
  willPrint,
  teamPublications,
  loading
}) => {
  const handleNumberInputsChange = (event) => {
    event.persist();
    if(  Number.isInteger(parseInt(event.target.value)))
       {setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: parseInt(event.target.value),
        }));
      
        console.log("inputs",inputs);}
  };
  const handleInputsChange = (event) => {
    event.persist();
   
       setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.value,
        }));
      
        console.log("inputs",inputs);}
  
  useEffect(() => {
    console.log(inputsSkeleton);
    console.log("inputs",inputs);
    inputsSkeleton.forEach((input) => {
      console.log("undef",inputs[input.name]);
      if (
        input.type === "select" &&
        input.options.length &&
        inputs[input.name] === undefined
      )
        setInputs((inputs) => ({
          ...inputs,
          [input.name ]: 2015,
        }));
       

    });
  }, [inputs, inputsSkeleton, setInputs]);

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="card-header">
          <h3 className="card-title">
              {title}          
          </h3>
        </div>

        <div className="card-body">
          {inputsSkeleton.map((input,index) => (
            <Fragment key={index}>
              {input.type === "input" && (
                <div className="form-group mt-2">
                  <label className="form-label">{input.label}</label>
                  <input
                    required
                    type="text"
                    pattern="[0-9]*"
                    className="form-control"
                    onChange={handleNumberInputsChange}
                    value={inputs[input.name]}
                    name={input.name}
                  />
                </div>
              )}

              {input.type === "select" && (
                <div className="form-group mt-2">
                  <label className="form-label">{input.label}</label>
                  <select
                    name={input.name }
                    onChange={handleInputsChange}
                    value={inputs[input.name ]}
                    className="form-control"
                  >
                    {input.options.map((option, index) => (
                      <option value={option}  key={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="card-footer text-right">
         { !willPrint&&
         <div>
         <button onClick={cancelEdit} className="mr-2 btn btn-outline-danger">
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Soumettre
          </button>
          </div>}
          { willPrint&&
             <Fragment>
             <PDFDownloadLink className="btn  btn-sm m-1  btn-outline-primary" document={ <ReportTable teamPublications={teamPublications} team={inputs.team} year={inputs.year.toString()}/>} fileName={"Rapport"}>
               { (loading ? "Chargement du document..." : "Imprimer le rapport")}
             </PDFDownloadLink>
           </Fragment>     }
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
