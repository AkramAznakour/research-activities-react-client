import Author from "../views/Author/Author";
import AuthorSearch from "../views/Author/AuthorSearch";
import HomePage from "../views/HomePage/HomePage";
import PageNotFound from "../views/components/PageNotFound";

import University from "../views/ManagingEntities/University";
import Establishments from "../views/ManagingEntities/Establishments";
import Laboratories from "../views/ManagingEntities/Laboratories";
import Teams from "../views/ManagingEntities/Teams";
import AccountSettings from "../views/Settings/AccountSettings";
import LaboratoryHeads from "../views/ManagingAccounts/LaboratoryHeads";
import Researchers from "../views/ManagingAccounts/Researchers";
import FollowedResearchers from "../views/ManagingAccounts/FollowedResearchers";
import Statistics from "../views/Statistics/Statistics";
import Profile from "../views/Profile/Profile";
import Team from "../views/ManagingEntities/Team";
import Laboratory from "../views/ManagingEntities/Laboratory";
import PhdPage from "../views/ManagingEntities/PhdPage";

import LabTree from "../views/ManagingEntities/LabTree";
import ResearchDirector from "../views/ManagingAccounts/ResearchDirector";
import LaboratoriesOfDirector from "../views/ManagingEntities/DirectorViews/LaboratoriesOfDirector";
import TeamOfDirector from "../views/ManagingEntities/DirectorViews/TeamOfDirector";
import DirectorTeamsStatistics from "../views/Statistics/DirectorTeamsStatistics";
import DirectorLabsStatistics from "../views/Statistics/DirectorLabStatistics";


import {
  HomeIcon,
  StatisticsIcon,
  UserCheckIcon,
  TeamIcon,
  SettingsIcon,
  PhdIcon,

  BudgetIcon,

} from "../views/components/icons";
import TeamsStatistics from "../views/Statistics/TeamsStatistics";
import LabStatistics from "../views/Statistics/labStatistics";
import LaboratoryBudget from "../views/ManagingEntities/LaboratoryBudget";

import EstablishmentBudget from "../views/ManagingEntities/EstablishmentBudget";
import AddBudget from "../views/components/AddBudget";
import Report from "../views/Statistics/Report";



const allRoles = [
  "CED_HEAD",
  "CED_HEAD",
  "TEAM_HEAD",
  "LABORATORY_HEAD",
  "RESEARCHER",
];

const entitiesPathsCategory = {
  title: "Entités",
  isDropdown: true,
  icon: SettingsIcon,
  routes: [
    {
      title: "Université",
      path: "/university",
      component: University,
      roles: ["CED_HEAD", "CED_HEAD"],
      inMenu: true,
    },
    {
      title: "Établissements",
      path: "/establishments",
      component: Establishments,
      roles: ["CED_HEAD", "CED_HEAD"],
      inMenu: true,
    },
    {
      title: "Laboratoires",
      path: "/laboratories",
      component: Laboratories,
      roles: ["CED_HEAD", "CED_HEAD"],
      inMenu: true,
    },
    {
      title: "Équipes",
      path: "/teams",
      component: Teams,
      roles: ["LABORATORY_HEAD"],
      inMenu: true,
    },
    {
      title: "Organigramme",
      path: "/labTree",
      component: LabTree,
      inMenu: true,
      roles: ["LABORATORY_HEAD"],
    },
    {
      title: "Équipe",
      path: "/team/:teamId",
      component: Team,
      roles: ["CED_HEAD", "LABORATORY_HEAD", "TEAM_HEAD"],
      inMenu: false,
    },
    {
      title: "Laboratoire",
      path: "/Laboratory/:laboratoryId",
      component: Laboratory,
      roles: ["CED_HEAD", "CED_HEAD", "RESEARCH_DIRECTOR"],
      inMenu: false,
    },
    
  ],
};

const researchDirectorPaths = {
  title: "Direction de recherche",
  isDropdown: true,
  icon: SettingsIcon,
  routes: [
    {
      title: "Laboratoires",
      path: "/laboratories-of-director",
      component: LaboratoriesOfDirector,
      roles: ["RESEARCH_DIRECTOR"],
      inMenu: true,
    },
    {
      title: "Statistiques de laboratoires",
      path: "/director-lab-statistics",
      component: DirectorLabsStatistics,
      icon: StatisticsIcon,
      roles: ["RESEARCH_DIRECTOR"],
      inMenu: true,
    },
    {
      title: "Statistiques d'équipes",
      path: "/director-teams-statistics",
      component: DirectorTeamsStatistics,
      icon: StatisticsIcon,
      roles: ["RESEARCH_DIRECTOR"],
      inMenu: true,
    },
    {
      title: "Equipe",
      path: "/team-of-director/:teamId",
      component: TeamOfDirector,
      roles: ["RESEARCH_DIRECTOR"]
    },

  ]
};

const accountsManagementPathsCategory = {
  title: "Gestion des comptes",
  isDropdown: true,
  icon: SettingsIcon,
  routes: [
    {
      title: "Comptes chefs des Laboratoires",
      path: "/laboratory-heads",
      component: LaboratoryHeads,
      roles: ["CED_HEAD"],
      icon: TeamIcon,
      inMenu: true,
    },
    {
      title: "Comptes chercheurs",
      path: "/researchers",
      component: Researchers,
      roles: ["LABORATORY_HEAD"],
      icon: TeamIcon,
      inMenu: true,
    },
    {
      title: "Compte Directeur de recherche",
      path: "/research-director",
      component: ResearchDirector,
      roles: ["CED_HEAD"],
      icon: TeamIcon,
      inMenu: true,
    },
    
    
  ],
};

const StatisticsPaths = {
  title: "Statistiques",
  isDropdown: true,
  icon: StatisticsIcon,
  routes: [
    {
      title: "Statistiques",
      path: "/statistics",
      component: Statistics,
      icon: StatisticsIcon,
      roles: ["LABORATORY_HEAD"],
      inMenu: true,
    },
    {
      title: "Statistiques d'équipes",
      path: "/teamStatistics",
      component: TeamsStatistics,
      icon: StatisticsIcon,
      roles: ["LABORATORY_HEAD"],
      inMenu: true,
    },
    {
      title: "Statistiques des laboratoires",
      path: "/labStatistics",
      component: LabStatistics,
      icon: StatisticsIcon,
      roles: ["CED_HEAD","CED_HEAD"],
      inMenu: true,
    },
    
  ],
};

const budgetPath = {
title: "Budget",
  isDropdown: false,
  icon : BudgetIcon,
  routes: [
    {

      title: "Budget",
      path: "/Budget",
      component: LaboratoryBudget,
     roles: ["LABORATORY_HEAD"],
  icon: BudgetIcon,
  inMenu: true,
    },
    
    {
      title: "Budget",
      path: "/Budget-CED",
      component: EstablishmentBudget,
      roles: ["CED_HEAD","CED_HEAD"],
      icon: TeamIcon,
      inMenu: true,
     }

  ]
}
    
const reportPath = {
  title: "Rapport",
  isDropdown: false,
  routes: [
    {
      title: "Rapport",
      path: "/Rapport",
      component: Report,
      roles: ["LABORATORY_HEAD"],
      icon: TeamIcon,
      inMenu: true,
    },
  ],
};

const followedResearchersPaths = {
  title: "Chercheur suivis",
  isDropdown: false,
  routes: [
    {
      title: "Chercheur suivis",
      path: "/followed-researchers",
      component: FollowedResearchers,
      icon: UserCheckIcon,
      roles: ["LABORATORY_HEAD"],
      inMenu: true,
    },
  ],
};
const phdStudentsPaths = {
  title: "Doctorants",
  isDropdown: false,
  routes: [
    {
      title: "Doctorants",
      path: "/phd",
      component: PhdPage,
      icon: PhdIcon,
      roles: allRoles,
      inMenu: true,
    },
  ],
};

const communPathsCategory = {
  isDropdown: false,
  routes: [
    {
      title: "Accueil",
      path: "/",
      component: HomePage,
      icon: HomeIcon,
      inMenu: true,
      roles: allRoles,
    },
    

    {
      title: "Profile",
      path: "/Profile/:id",
      component: Profile,
      inMenu: false,
      roles: allRoles,
    },
    {
      title: "Compte",
      path: "/account",
      component: AccountSettings,
      inMenu: false,
      roles: allRoles,
    },
  ],
};

const authorPathsCategory = {
  isDropdown: false,
  inMenu: false,
  routes: [
    {
      title: "Auteur",
      path: "/author/:platform/:authorId",
      component: Author,
      inMenu: false,
      roles: allRoles,
    },
    {
      title: "Recherche d'auteur",
      path: "/author-search/:authorName",
      component: AuthorSearch,
      inMenu: false,
      roles: allRoles,
    },
  ],
};

const errorPathsCategory = {
  title: "Errors",
  isDropdown: false,
  routes: [
    {
      title: "Errors",
      path: "/*",
      component: PageNotFound,
      inMenu: false,
      roles: allRoles,
    },
  ],
};

const menus = [
  communPathsCategory,
  authorPathsCategory,
  entitiesPathsCategory,
  accountsManagementPathsCategory,
  followedResearchersPaths,
  researchDirectorPaths,
  phdStudentsPaths,
  StatisticsPaths,
  budgetPath,
  errorPathsCategory,
  reportPath
  
];

const routes = [
  ...communPathsCategory.routes,
  ...authorPathsCategory.routes,
  ...entitiesPathsCategory.routes,
  ...accountsManagementPathsCategory.routes,
  ...followedResearchersPaths.routes,
  ...researchDirectorPaths.routes,
  ...phdStudentsPaths.routes,
  ...StatisticsPaths.routes,
  ...budgetPath.routes,
  ...reportPath.routes,
  ...errorPathsCategory.routes,
  
];

export { routes, menus };
