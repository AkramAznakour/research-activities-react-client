import React, { useEffect } from "react";
import Publication from "./Publication";

const Publications = ({ author, setAuthor, platform }) => {
  useEffect(() => {
    setTimeout(() => {
      const publicationsTmp = author.publications.map((p) => ({
        ...p,
        searchedFor: true,
      }));
      setAuthor(() => ({
        ...author,
        publications: publicationsTmp,
      }));
    }, author.publications.length * 4000);
  }, []);

  const updatePublication = (index, publication) => {
    const i = author.publications.map(p=>p.title).indexOf(publication.title);
    let tempPublications = author.publications;
    tempPublications[i] = publication;
    setAuthor(() => ({
      ...author,
      publications: tempPublications,
    }));
  };

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap ">
          <thead>
            <tr>
              <th>Titre</th>
              <th className="text-center">Année</th>
              <th className="text-center">Citée</th>
              <th className="text-center">IF</th>
              <th className="text-center">SJR</th>
              <th className="text-center">
                Récupération <br /> des données
              </th>
            </tr>
          </thead>
          <tbody>
            {author.publications &&
              author.publications
                .sort((a, b) => b.title - a.title)
                .map((publication, index) => (
                  <Publication
                    index={index}
                    platform={platform}
                    key={index}
                    publication={publication}
                    updatePublication={updatePublication}
                    author={author}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Publications;
