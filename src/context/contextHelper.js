const userShortBio = ({
  laboratoriesHeaded,
  teamsHeaded,
  teamsMemberships,
  establishmentsDirected,
  ...user
}) => {
  if (user.roles.includes("CED_HEAD")) return ["chef de CED"];


  const roles = [];
  roles.push(laboratoriesHeaded
    .map(({ abbreviation }) => `chef de laboratoire ${abbreviation}`)
    .join(" , "));

  roles.push(teamsHeaded
    .map(({ abbreviation }) => `chef de l'équipe ${abbreviation}`)
    .join(" , "));

  /*roles.push(teamsMemberships
    .map(({ abbreviation }) => `membre de l'équipe ${abbreviation}`)
    .join(" , "));*/

  roles.push(establishmentsDirected
    .map(({ abbreviation }) => `Directeur de recherche de ${abbreviation}`)
    .join(" , "));
 
  let shortBio = []
  roles.forEach((role)=>{
    if (role !== "") shortBio.push(role + ". ");
  })

  if(!shortBio.length)
    shortBio = ["Chercheur"];

  
    return shortBio;
  /*if (shortBio.length > 10) return shortBio;
  else return "Chercheur";*/

};

const userHeadedLaboratories = ({ laboratoriesHeaded }) =>
  laboratoriesHeaded.map(({ name, abbreviation }) => abbreviation).join(" , ");

const UserHelper = {
  userShortBio,
  userHeadedLaboratories,
};

export { UserHelper };
