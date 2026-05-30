import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function HarvardCVTemplate({ cvData }: { cvData: CVProfile }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 35,
      fontSize: 10,
      fontFamily: "Times-Roman",
      color: "#000000",
    },
    header: {
      alignItems: "center",
      marginBottom: 15,
    },
    name: {
      fontSize: 22,
      fontFamily: "Times-Bold",
      marginBottom: 4,
    },
    contactInfo: {
      fontSize: 9,
      marginBottom: 2,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: "Times-Bold",
      borderBottomWidth: 1,
      borderBottomColor: "#000000",
      paddingBottom: 2,
      marginBottom: 8,
      marginTop: 12,
      textTransform: "uppercase",
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 2,
    },
    itemTitle: {
      fontFamily: "Times-Bold",
      fontSize: 10,
    },
    companyName: {
      fontStyle: "italic",
      fontSize: 10,
    },
    itemMeta: {
      fontSize: 9,
    },
    bullet: {
      marginLeft: 15,
      marginBottom: 2,
      lineHeight: 1.2,
      fontSize: 9,
    },
    skillRow: {
      flexDirection: "row",
      marginBottom: 4,
    },
    skillCat: {
      fontFamily: "Times-Bold",
      width: 70,
    },
    skillList: {
      flex: 1,
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
          <Text style={styles.contactInfo}>
            {cvData.datosPersonales.ubicacion} | {cvData.datosPersonales.telefono} | {cvData.datosPersonales.email}
          </Text>
          {(cvData.datosPersonales.linkedin || cvData.datosPersonales.github) && (
             <Text style={styles.contactInfo}>
               {cvData.datosPersonales.linkedin} {cvData.datosPersonales.github ? ` | ${cvData.datosPersonales.github}` : ""}
             </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>EXPERIENCE</Text>
        {cvData.experiencia.map((exp, idx) => (
          <View key={idx} style={{ marginBottom: 8 }}>
            <View style={styles.itemHeader}>
              <Text><Text style={styles.itemTitle}>{exp.puesto}</Text>, <Text style={styles.companyName}>{exp.empresa}</Text></Text>
              <Text style={styles.itemMeta}>{exp.fechaInicio} - {exp.fechaFin}</Text>
            </View>
            {exp.logros.map((logro, lIdx) => (
              <Text key={lIdx} style={styles.bullet}>• {logro}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>EDUCATION</Text>
        {cvData.educacion.map((edu, idx) => (
          <View key={idx} style={{ marginBottom: 6 }}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{edu.institucion}</Text>
              <Text style={styles.itemMeta}>{edu.fechaInicio} - {edu.fechaFin}</Text>
            </View>
            <Text style={styles.companyName}>{edu.titulo}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>SKILLS</Text>
        {["frontend", "backend", "database", "cloud", "devops", "soft-skill", "other"].map(cat => {
          const skillsInCat = cvData.habilidades.filter((s) => s.categoria === cat);
          if (skillsInCat.length === 0) return null;
          return (
            <View key={cat} style={styles.skillRow}>
              <Text style={styles.skillCat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}:</Text>
              <Text style={styles.skillList}>{skillsInCat.map(s => s.nombre).join(", ")}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
