import React, { useEffect } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    color: "grey",
  },
  table: {
    display: "table",
    borderStyle: "solid",
    borderColor: "#eceeef",
    borderWidth: 1,
    marginBottom: "2rem",
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#eceeef",
    borderWidth: 1,
    padding: "1rem",
  },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
});

// Create Document Component
const ReportTable = ({teamPublications, team, year}) => {

    console.log(teamPublications);
 
  return (
   
    <Document
   
    
  >
    <Page orientation="landscape" style={styles.body}>
      <Text style={styles.subtitle}>{"Publications de l'équipe " + team+ " pendant l'année "+ year}</Text>
        <View style={styles.table} key={teamPublications}>
          {/* TableHeader */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: "70%" }}>
              <Text style={styles.tableCell}>Titre complet de la publication</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "30%" }}>
              <Text style={styles.tableCell}>Auteurs</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "30%" }}>
              <Text style={styles.tableCell}>Source</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Année</Text>
            </View>

            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>IF</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>SJR</Text>
            </View>

          </View>
          {teamPublications.map((publication, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "70%" }}>
                <Text style={styles.tableCell}>{publication.title}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "30%" }}>
                <Text style={styles.tableCell}>{publication.authors.join(", ")} </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "30%" }}>
                <Text style={styles.tableCell}>{publication.source} </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{publication.year}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{publication.IF}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{publication.SJR}</Text>
              </View>
            </View>
          ))}
        </View>
     </Page>
     </Document>
    
  );
};

export default ReportTable;
