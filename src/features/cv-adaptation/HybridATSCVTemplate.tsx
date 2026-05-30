import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function HybridATSCVTemplate({ cvData }: { cvData: CVProfile }) {
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
      marginBottom: 10,
      textAlign: "center",
    },
    name: {
      fontSize: 22,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      marginBottom: 4,
    },
    contactInfo: {
      fontSize: 8,
      color: "#475569",
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      borderBottomWidth: 1,
      borderBottomColor: "#CBD5E1",
      paddingBottom: 2,
      marginBottom: 8,
      marginTop: 12,
      textTransform: "uppercase",
    },
    summaryBlock: {
      fontSize: 8.5,
      lineHeight: 1.4,
      textAlign: "justify",
    },
    skillsWall: {
      fontSize: 8.5,
      lineHeight: 1.4,
    },
    jobBlock: {
      marginBottom: 8,
    },
    jobHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
    },
    jobMeta: {
      fontSize: 8,
      color: "#475569",
    },
    companyName: {
      fontSize: 9,
      fontStyle: "italic",
      marginBottom: 3,
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 2,
      lineHeight: 1.3,
      fontSize: 8.5,
    }
  });

  const technicalSkills = cvData.habilidades.filter(s => s.categoria !== "soft-skill").map(s => s.nombre).join(" • ");
  const softSkills = cvData.habilidades.filter(s => s.categoria === "soft-skill").map(s => s.nombre).join(" • ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
          <Text style={styles.contactInfo}>
            {cvData.datosPersonales.ubicacion} | {cvData.datosPersonales.telefono} | {cvData.datosPersonales.email}
            {cvData.datosPersonales.linkedin ? ` | ${cvData.datosPersonales.linkedin}` : ""}
          </Text>
        </View>

        {cvData.experiencia.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryBlock}>{cvData.experiencia[0].descripcion}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>CORE COMPETENCIES & SKILLS</Text>
        <Text style={styles.skillsWall}><Text style={{ fontFamily: "Helvetica-Bold" }}>Technical: </Text>{technicalSkills}</Text>
        {softSkills && (
           <Text style={styles.skillsWall}><Text style={{ fontFamily: "Helvetica-Bold" }}>Soft Skills: </Text>{softSkills}</Text>
        )}

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
      </Page>
    </Document>
  );
}
