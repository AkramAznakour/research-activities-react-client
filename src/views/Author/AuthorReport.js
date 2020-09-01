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
const AuthorReport = ({ author }) => {
  useEffect(() => {
    console.log("should update");
  }, [author]);

  return (
    <Document
      author={author.name}
      keywords={author.name}
      subject={author.name}
      title={author.name}
    >
      <Page style={styles.body}>
        <Text style={styles.title}>{author.name}</Text>
        <Text style={styles.author}>{author.university}</Text>
        <Text style={styles.subtitle}>Citations : </Text>
        <View style={styles.table}>
          {/* TableHeader */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: "40%" }}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={{ ...styles.tableCol, width: "30%" }}>
              <Text style={styles.tableCell}>Toutes</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "30%" }}>
              <Text style={styles.tableCell}>
                Depuis {new Date().getFullYear() - 5}
              </Text>
            </View>
          </View>
          {author.indexes.map(({ name, total, lastFiveYears }, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "40%" }}>
                <Text style={styles.tableCell}>{name}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "30%" }}>
                <Text style={styles.tableCell}>{total} </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "30%" }}>
                <Text style={styles.tableCell}>{lastFiveYears}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.subtitle}>Publications : </Text>
        <View style={styles.table}>
          {/* TableHeader */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: "80%" }}>
              <Text style={styles.tableCell}>Title</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>Année</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>citations</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>SJR</Text>
            </View>

            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>IF</Text>
            </View>
          </View>
          {author.publications
          .sort(
            (a, b) =>
              parseInt(b.year.trim() || 0)  - parseInt(a.year.trim() || 0)
          )
          .map((publication, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "80%" }}>
                <Text style={styles.tableCell}>{publication.title}</Text>
                <Text style={{ ...styles.tableCell, color: "gray" }}>
                  {publication.authors.join(", ")}
                </Text>
                <Text style={{ ...styles.tableCell, color: "gray" }}>
                  {publication.source ? publication.source : ""}

                  {publication.extraInformation &&
                  publication.extraInformation["Conference"]
                    ? publication.extraInformation["Conference"]
                    : ""}
                  {publication.extraInformation &&
                  publication.extraInformation["Journal"]
                    ? publication.extraInformation["Journal"]
                    : ""}
                </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={styles.tableCell}>{publication.year} </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={styles.tableCell}>{publication.citation} </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={styles.tableCell}>{publication.SJR ?? ""}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={styles.tableCell}>{publication.IF ?? ""}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default AuthorReport;
