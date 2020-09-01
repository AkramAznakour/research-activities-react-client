const makeAuthentificationService = (api) => ({
  signup: (user) => api.post(`/signup`, user),
  login: (user) => api.post(`/login`, user),
});

const makeScraperService = (api) => ({
  authorSearch: (authorName) => api.get(`/author-search/${authorName}`),
  getAuthorData: (platform, authorId) =>
    api.get(`/author/${platform}/${authorId}`),
  getJournalData: (jouranlName,year) => api.get(`/journal/${jouranlName}/${year}`),
});

const makeUserService = (api) => ({
  createUser: (user) => api.post(`/users`, user),
  updateUser: (user) => api.put(`/users`, user),
  findUser: (_id) => api.get(`/users/${_id}`),
  findAllUsers: () => api.get(`/users`),
  deleteUser: (_id) => api.delete(`/users/${_id}`),
  updatePassword: (_id, passwords) =>
    api.post(`/users/${_id}/update-password`, passwords),
  updateProfilePicture: (formData) =>
    api.post(`/upload-profile-picture`, formData),
  getLaboratoryHeads: () => api.get(`/laboratory-heads`),
  getResearchers: () => api.get(`/researchers`),
  followUser: (user) => api.post(`/follow`, user),
  updateFollowUser: (user) => api.post(`/update-followed-user`, user),
  unfollowUser: (authorId) => api.get(`/unfollow/${authorId}`),
  isFollowing: (authorId) => api.get(`/is-following/${authorId}`),
  getFollowedUsers: (filter) => api.get(`/followed-users`, { params: filter }),
  getFilteringOptions: (laboratoryHeadId) =>
    api.get(`/filtering-options/${laboratoryHeadId}`),
  getDirectorFilteringOptions: (directorId) => api.get(`/director-filtering-options/${directorId}`)
});
// const makePhdService = (api) => ({
//   createUser: (user) => api.post(`/users`, user),
//   updateUser: (user) => api.put(`/users`, user),
//   findUser: (_id) => api.get(`/users/${_id}`),
//   findAllUsers: () => api.get(`/users`),
//   deleteUser: (_id) => api.delete(`/users/${_id}`),
 
 
  
  
// });

const makeUniversityService = (api) => ({
  createUniversity: (university) => api.post(`/universities`, university),
  updateUniversity: (university) => api.put(`/universities`, university),
  findUniversity: (_id) => api.get(`/universities/${_id}`),
  findAllUniversities: () => api.get(`/universities`),
  deleteUniversity: (_id) => api.delete(`/universities/${_id}`),
  getUniversityEstablishments: (_id) => api.get(`/universities/${_id}/establishments`)
});

const makeEstablishmentService = (api) => ({
  createEstablishment: (establishment) => api.post(`/establishments`, establishment),
  updateEstablishment: (establishment) => api.put(`/establishments`, establishment),
  findEstablishment: (_id) => api.get(`/establishments/${_id}`),
  findAllEstablishments: () => api.get(`/establishments`),
  deleteEstablishment: (_id) => api.delete(`/establishments/${_id}`),
  getEstablishmentLaboratories: (_id) => api.get(`/establishments/${_id}/laboratories`),
  setEstablishmentResearchDirector: (establishment_id, user_id) => api.post(`/research-director/${establishment_id}/${user_id}`),
  getEstablishmentOfDirector: (director_id) => api.get(`/establishment-of-director/${director_id}`)
});

const makeLaboratoryService = (api) => ({
  createLaboratory: (laboratory) => api.post(`/laboratories`, laboratory),
  updateLaboratory: (laboratory) => api.put(`/laboratories`, laboratory),
  findLaboratory: (_id) => api.get(`/laboratories/${_id}`),
  findAllLaboratories: () => api.get(`/laboratories`),
  deleteLaboratory: (_id) => api.delete(`/laboratories/${_id}`),
  getTeamsOfLaboratory: (_id) => api.get(`/laboratories/${_id}/teams`),
  getLaboratoryOfHead: (head_id) => api.get(`/laboratories-of-head/${head_id}`),
  getFreeLaboratories: () => api.get(`/free-laboratories`),
  associateHeadToLaboratory: (head_id, lab_id) =>
    api.get(`/entitle-laboratory/${head_id}/${lab_id}`),
  getLaboratoriesOfDirector: (user_id) => api.get(`/laboratories-of-director/${user_id}`),
  getNodesForOrgChart: () => api.get(`/nodesForOrgChart`)
});

const makeTeamService = (api) => ({
  createTeam: (team) => api.post(`/teams`, team),
  updateTeam: (team) => api.put(`/teams`, team),
  findAllTeams: () => api.get(`/teams`),
  findTeam: (_id) => api.get(`/teams/${_id}`),
  deleteTeam: (_id) => api.delete(`/teams/${_id}`),
  addUserToTeam: (team_id, user_id) =>
    api.get(`/add-to-team/${team_id}/${user_id}`),
  removeFromTeam: (team_id, user_id) =>
    api.get(`/remove-from-team/${team_id}/${user_id}`),
  associateHeadToTeam: (team_id, head_id) =>
    api.get(`/team-head-association/${team_id}/${head_id}`),
});
const makePhdStudentsService = (api) => ({
  createPhdStudent: (phdStudent) => api.post(`/phdStudents`, phdStudent),
  updatePhdStudent: (phdStudent) => api.put(`/phdStudents`, phdStudent),
  findAllPhdStudents: () => api.get(`/phdStudents`),
  findstudent: (_id) => api.get(`/phdStudents/${_id}`),
  deletePhdStudent: (_id) => api.delete(`/phdStudents/${_id}`),
  findStudentsOfUser: () => api.get(`/phdStudentsOfUser`)
 
});
const makeStatisticsService = (api) => ({
  getStatistics: (filter) => api.get(`/statistics`, { params: filter }),
  getPublicationsPerTeam: (filter) => api.get(`/team-publications`, { params: filter }),

});

const makeNotificationsService = (api) => ({
  findUserNotifications: (user_id) => api.get(`/notifications/${user_id}`),
  notifyFolloweers: ({
    publication,
    scrapedPublications,
    followedUserId,
    authorId,
  }) =>
    api.post(`/notify-followers`, {
      publication,
      followed_user_id: followedUserId,
      author_id: authorId,
      scraped_publications: scrapedPublications,
    }),
  markNotificationAsRead: (notificationId) =>
    api.post(`/mark-notification-as-read/${notificationId}`),
});

export {
  makeUserService,
  makeUniversityService,
  makeEstablishmentService,
  makeLaboratoryService,
  makeTeamService,
  makePhdStudentsService,
  makeScraperService,
  makeAuthentificationService,
  makeStatisticsService,
  makeNotificationsService,
};
