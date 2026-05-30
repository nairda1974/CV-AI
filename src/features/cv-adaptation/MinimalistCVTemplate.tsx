import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function MinimalistCVTemplate({ cvData }: { cvData: CVProfile }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 40,
      fontSize: 9,
      fontFamily: "Helvetica",
      color: "#333333",
    },
    header: {
      marginBottom: 20,
    },
    name: {
      fontSize: 26,
      color: "#000000",
      letterSpacing: -1,
      marginBottom: 8,
    },
    contactInfo: {
      fontSize: 8,
      color: "#666666",
      lineHeight: 1.4,
    },
    sectionBlock: {
      flexDirection: "row",
      marginBottom: 15,
    },
    leftCol: {
      width: "25%",
      paddingRight: 10,
    },
    rightCol: {
      width: "75%",
    },
    sectionTitle: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: "#999999",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    jobBlock: {
      marginBottom: 12,
    },
    jobTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: "#000000",
      marginBottom: 2,
    },
    jobMeta: {
      fontSize: 8,
      color: "#666666",
      marginBottom: 4,
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 3,
      lineHeight: 1.4,
      fontSize: 8.5,
      color: "#444444",
    },
    skillText: {
      fontSize: 8.5,
      color: "#444444",
      lineHeight: 1.5,
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
          <Text style={styles.contactInfo}>{cvData.datosPersonales.email}  //  {cvData.datosPersonales.telefono}  //  {cvData.datosPersonales.ubicacion}</Text>
          {cvData.datosPersonales.linkedin && <Text style={styles.contactInfo}>{cvData.datosPersonales.linkedin}</Text>}
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.leftCol}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
          </View>
          <View style={styles.rightCol}>
            {cvData.experiencia.map((exp, idx) => (
              <View key={idx} style={styles.jobBlock}>
                <Text style={styles.jobTitle}>{exp.puesto}</Text>
                <Text style={styles.jobMeta}>{exp.empresa}  |  {exp.fechaInicio} - {exp.fechaFin}</Text>
                {exp.logros.map((logro, lIdx) => (
                  <Text key={lIdx} style={styles.bullet}>•  {logro}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.leftCol}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
          </View>
          <View style={styles.rightCol}>
            {cvData.educacion.map((edu, idx) => (
              <View key={idx} style={styles.jobBlock}>
                <Text style={styles.jobTitle}>{edu.titulo}</Text>
                <Text style={styles.jobMeta}>{edu.institucion}  |  {edu.fechaInicio} - {edu.fechaFin}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.leftCol}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.skillText}>
              {cvData.habilidades.map(s => s.nombre).join("  •  ")}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
