import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function TechStartupCVTemplate({ cvData, themeColor = "#10B981" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      padding: 0,
      fontSize: 9,
      fontFamily: "Helvetica",
    },
    leftCol: {
      width: "30%",
      backgroundColor: "#0F172A",
      color: "#F8FAFC",
      padding: 25,
      paddingTop: 30,
    },
    rightCol: {
      width: "70%",
      padding: 30,
      color: "#1E293B",
    },
    photo: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginBottom: 20,
    },
    name: {
      fontSize: 20,
      fontFamily: "Helvetica-Bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    puesto: {
      fontSize: 10,
      color: themeColor,
      textTransform: "uppercase",
      marginBottom: 20,
    },
    sidebarTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: "#94A3B8",
      borderBottomWidth: 1,
      borderBottomColor: "#334155",
      paddingBottom: 4,
      marginBottom: 10,
      marginTop: 20,
    },
    contactText: {
      fontSize: 8,
      marginBottom: 6,
      color: "#CBD5E1",
    },
    skillBadge: {
      backgroundColor: "#1E293B",
      color: themeColor,
      padding: "3 6",
      borderRadius: 4,
      fontSize: 7,
      marginBottom: 4,
      marginRight: 4,
    },
    skillContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    sectionTitleRight: {
      fontSize: 14,
      fontFamily: "Helvetica-Bold",
      color: "#0F172A",
      marginBottom: 15,
      marginTop: 10,
    },
    jobBlock: {
      marginBottom: 12,
      borderLeftWidth: 2,
      borderLeftColor: themeColor,
      paddingLeft: 10,
    },
    jobTitle: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: "#0F172A",
    },
    jobMeta: {
      fontSize: 8,
      color: "#64748B",
      marginBottom: 4,
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 2,
      lineHeight: 1.3,
      fontSize: 8.5,
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.leftCol}>
          {cvData.datosPersonales.fotoUrl && (
            <Image src={cvData.datosPersonales.fotoUrl} style={styles.photo} />
          )}
          <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
          <Text style={styles.puesto}>{cvData.experiencia[0]?.puesto || "Profesional"}</Text>

          <Text style={styles.sidebarTitle}>INFO</Text>
          <Text style={styles.contactText}>{cvData.datosPersonales.email}</Text>
          <Text style={styles.contactText}>{cvData.datosPersonales.telefono}</Text>
          <Text style={styles.contactText}>{cvData.datosPersonales.ubicacion}</Text>
          {cvData.datosPersonales.linkedin && <Text style={styles.contactText}>{cvData.datosPersonales.linkedin}</Text>}
          {cvData.datosPersonales.github && <Text style={styles.contactText}>{cvData.datosPersonales.github}</Text>}

          <Text style={styles.sidebarTitle}>TECH SKILLS</Text>
          <View style={styles.skillContainer}>
            {cvData.habilidades.filter(s => s.categoria !== "soft-skill").map((skill, idx) => (
              <Text key={idx} style={styles.skillBadge}>{skill.nombre}</Text>
            ))}
          </View>
        </View>

        <View style={styles.rightCol}>
          <Text style={styles.sectionTitleRight}>EXPERIENCE</Text>
          {cvData.experiencia.map((exp, idx) => (
            <View key={idx} style={styles.jobBlock}>
              <Text style={styles.jobTitle}>{exp.puesto}</Text>
              <Text style={styles.jobMeta}>{exp.empresa} | {exp.fechaInicio} - {exp.fechaFin}</Text>
              {exp.logros.map((logro, lIdx) => (
                <Text key={lIdx} style={styles.bullet}>• {logro}</Text>
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitleRight}>EDUCATION</Text>
          {cvData.educacion.map((edu, idx) => (
            <View key={idx} style={styles.jobBlock}>
              <Text style={styles.jobTitle}>{edu.titulo}</Text>
              <Text style={styles.jobMeta}>{edu.institucion} | {edu.fechaInicio} - {edu.fechaFin}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
