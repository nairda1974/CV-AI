import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function ExecutiveCVTemplate({ cvData, themeColor = "#1E293B" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30,
      fontSize: 9,
      fontFamily: "Helvetica",
      color: "#0F172A",
    },
    header: {
      marginBottom: 15,
      borderTopWidth: 4,
      borderTopColor: themeColor,
      paddingTop: 15,
    },
    name: {
      fontSize: 24,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 5,
    },
    contactInfo: {
      fontSize: 8,
      color: "#475569",
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      backgroundColor: "#F1F5F9",
      padding: "4 8",
      marginBottom: 10,
      marginTop: 15,
      color: themeColor,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    jobBlock: {
      marginBottom: 10,
      paddingLeft: 8,
    },
    jobHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
    },
    jobMeta: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
    },
    companyName: {
      fontSize: 9,
      color: "#334155",
      marginBottom: 4,
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 2,
      lineHeight: 1.3,
      fontSize: 8.5,
      color: "#1E293B",
    },
    skillContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingLeft: 8,
    },
    skillPill: {
      border: `1px solid ${themeColor}`,
      color: themeColor,
      padding: "2 5",
      borderRadius: 12,
      fontSize: 7,
      marginRight: 4,
      marginBottom: 4,
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
          <Text style={styles.contactInfo}>
            {cvData.datosPersonales.email} • {cvData.datosPersonales.telefono} • {cvData.datosPersonales.ubicacion}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
        {cvData.experiencia.map((exp, idx) => (
          <View key={idx} style={styles.jobBlock}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{exp.puesto}</Text>
              <Text style={styles.jobMeta}>{exp.fechaInicio} — {exp.fechaFin}</Text>
            </View>
            <Text style={styles.companyName}>{exp.empresa}</Text>
            {exp.logros.map((logro, lIdx) => (
              <Text key={lIdx} style={styles.bullet}>- {logro}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>EDUCATION</Text>
        {cvData.educacion.map((edu, idx) => (
          <View key={idx} style={styles.jobBlock}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{edu.titulo}</Text>
              <Text style={styles.jobMeta}>{edu.fechaInicio} — {edu.fechaFin}</Text>
            </View>
            <Text style={styles.companyName}>{edu.institucion}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>CORE COMPETENCIES</Text>
        <View style={styles.skillContainer}>
          {cvData.habilidades.map((skill, idx) => (
            <Text key={idx} style={styles.skillPill}>{skill.nombre}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
