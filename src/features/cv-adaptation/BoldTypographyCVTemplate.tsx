import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function BoldTypographyCVTemplate({ cvData, themeColor = "#000000" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FAFAFA",
      padding: 35,
      fontSize: 9,
      fontFamily: "Helvetica",
      color: "#222222",
    },
    name: {
      fontSize: 38,
      fontFamily: "Helvetica-Bold",
      letterSpacing: -2,
      color: themeColor,
      marginBottom: 0,
      lineHeight: 1,
    },
    puesto: {
      fontSize: 14,
      fontFamily: "Helvetica-Bold",
      color: "#666666",
      letterSpacing: -0.5,
      marginBottom: 15,
    },
    contactInfo: {
      fontSize: 8,
      color: "#888888",
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      letterSpacing: -0.5,
      marginBottom: 10,
      marginTop: 20,
    },
    jobBlock: {
      marginBottom: 15,
    },
    jobTitle: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: "#000000",
      letterSpacing: -0.5,
    },
    jobMeta: {
      fontSize: 8,
      color: "#888888",
      marginBottom: 4,
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 3,
      lineHeight: 1.4,
      fontSize: 8.5,
      color: "#444444",
    },
    skillBadge: {
      backgroundColor: "#EEEEEE",
      color: "#000000",
      padding: "4 8",
      borderRadius: 4,
      fontSize: 8,
      marginRight: 4,
      marginBottom: 4,
      fontFamily: "Helvetica-Bold",
    },
    skillContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{cvData.datosPersonales.nombre.toLowerCase()}</Text>
        <Text style={styles.puesto}>{cvData.experiencia[0]?.puesto || "profesional"}</Text>
        <Text style={styles.contactInfo}>
          {cvData.datosPersonales.email}  |  {cvData.datosPersonales.telefono}  |  {cvData.datosPersonales.ubicacion}
        </Text>

        <Text style={styles.sectionTitle}>experience.</Text>
        {cvData.experiencia.map((exp, idx) => (
          <View key={idx} style={styles.jobBlock}>
            <Text style={styles.jobTitle}>{exp.puesto.toLowerCase()}</Text>
            <Text style={styles.jobMeta}>{exp.empresa} / {exp.fechaInicio} - {exp.fechaFin}</Text>
            {exp.logros.map((logro, lIdx) => (
              <Text key={lIdx} style={styles.bullet}>+ {logro}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>education.</Text>
        {cvData.educacion.map((edu, idx) => (
          <View key={idx} style={styles.jobBlock}>
            <Text style={styles.jobTitle}>{edu.titulo.toLowerCase()}</Text>
            <Text style={styles.jobMeta}>{edu.institucion} / {edu.fechaInicio} - {edu.fechaFin}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>skills.</Text>
        <View style={styles.skillContainer}>
          {cvData.habilidades.map((skill, idx) => (
            <Text key={idx} style={styles.skillBadge}>{skill.nombre.toLowerCase()}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
