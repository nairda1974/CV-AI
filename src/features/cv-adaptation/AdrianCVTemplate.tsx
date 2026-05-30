import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function AdrianCVTemplate({ cvData, themeColor = "#d1d5db" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      padding: 0,
      fontSize: 9,
      fontFamily: "Helvetica",
      color: "#1f2937",
    },
    topBand: {
      position: "absolute",
      top: 85,
      left: 0,
      right: 0,
      height: 25,
      backgroundColor: themeColor,
      zIndex: -1,
    },
    leftCol: {
      width: "35%",
      backgroundColor: "#f3f4f6",
      paddingTop: 150,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 20,
      minHeight: "100%",
    },
    rightCol: {
      width: "65%",
      backgroundColor: "#FFFFFF",
      paddingTop: 20,
      paddingLeft: 30,
      paddingRight: 30,
      paddingBottom: 20,
    },
    photoContainer: {
      position: "absolute",
      top: 25,
      left: 35,
      width: 130,
      height: 130,
      borderRadius: 65,
      border: "3px solid #ffffff",
      objectFit: "cover",
      zIndex: 10,
    },
    nameContainer: {
      marginBottom: 30,
      alignItems: "flex-end",
    },
    firstName: {
      fontSize: 32,
      fontFamily: "Times-Bold",
      letterSpacing: 2,
    },
    lastName: {
      fontSize: 32,
      fontFamily: "Times-Bold",
      letterSpacing: 2,
    },
    sidebarBox: {
      backgroundColor: themeColor,
      padding: 6,
      marginBottom: 15,
      marginTop: 20,
      alignItems: "center",
    },
    sidebarTitle: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      justifyContent: "center",
    },
    contactText: {
      fontSize: 9,
      textAlign: "center",
    },
    sectionTitleRight: {
      fontSize: 12,
      fontFamily: "Helvetica",
      letterSpacing: 2,
      textAlign: "center",
      marginBottom: 10,
      marginTop: 15,
    },
    paragraph: {
      fontSize: 9,
      lineHeight: 1.4,
      marginBottom: 10,
      textAlign: "justify",
    },
    jobHeader: {
      marginBottom: 2,
    },
    jobTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
    },
    companyName: {
      fontSize: 10,
    },
    jobDates: {
      fontSize: 9,
      marginBottom: 4,
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 3,
      lineHeight: 1.3,
    },
    skillTitle: {
      fontFamily: "Helvetica-Bold",
      marginBottom: 2,
    },
    educationItem: {
      marginBottom: 10,
      alignItems: "center",
      textAlign: "center",
    },
    educationTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 9,
      marginBottom: 4,
    },
    educationInst: {
      fontSize: 9,
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBand} />

        {cvData.datosPersonales.fotoUrl && (
          <Image src={cvData.datosPersonales.fotoUrl} style={styles.photoContainer} />
        )}

        <View style={styles.leftCol}>
          <View style={styles.sidebarBox}>
            <Text style={styles.sidebarTitle}>CONTACTO</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{cvData.datosPersonales.ubicacion}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{cvData.datosPersonales.telefono}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{cvData.datosPersonales.email}</Text>
          </View>

          <View style={styles.sidebarBox}>
            <Text style={styles.sidebarTitle}>EDUCACIÓN</Text>
          </View>
          {cvData.educacion.map((edu, idx) => (
            <View key={idx} style={styles.educationItem}>
              <Text style={styles.educationTitle}>• {edu.titulo}</Text>
              <Text style={styles.educationInst}>{edu.institucion}</Text>
            </View>
          ))}

          <View style={styles.sidebarBox}>
            <Text style={styles.sidebarTitle}>IDIOMAS / SOFT SKILLS</Text>
          </View>
          {cvData.habilidades.filter(s => s.categoria === "soft-skill" || s.categoria === "other").map((skill, idx) => (
            <Text key={idx} style={{ marginBottom: 4, textAlign: "center", fontSize: 9 }}>• {skill.nombre}</Text>
          ))}
        </View>

        <View style={styles.rightCol}>
          <View style={styles.nameContainer}>
            <Text style={styles.firstName}>{cvData.datosPersonales.nombre.split(" ")[0]}</Text>
            <Text style={styles.lastName}>{cvData.datosPersonales.nombre.split(" ").slice(1).join(" ")}</Text>
          </View>

          <Text style={styles.sectionTitleRight}>PERFIL PROFESIONAL</Text>
          {cvData.experiencia.length > 0 && (
             <Text style={styles.paragraph}>{cvData.experiencia[0].descripcion}</Text>
          )}

          <Text style={styles.sectionTitleRight}>EXPERIENCIA LABORAL</Text>
          {cvData.experiencia.map((exp, idx) => (
            <View key={idx} style={{ marginBottom: 12 }}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{exp.puesto}</Text>
                <Text style={styles.companyName}>{exp.empresa}</Text>
              </View>
              <Text style={styles.jobDates}>{exp.fechaInicio} - {exp.fechaFin}</Text>
              {exp.logros.map((logro, lIdx) => (
                <Text key={lIdx} style={styles.bullet}>• {logro}</Text>
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitleRight}>HABILIDADES TÉCNICAS</Text>
          <View style={{ marginLeft: 10 }}>
            {["frontend", "backend", "database", "cloud", "devops"].map(cat => {
              const skills = cvData.habilidades.filter(s => s.categoria === cat);
              if (!skills.length) return null;
              return (
                <View key={cat} style={{ flexDirection: "row", marginBottom: 4, flexWrap: "wrap", paddingRight: 15 }}>
                  <Text style={styles.skillTitle}>• {cat.charAt(0).toUpperCase() + cat.slice(1)}: </Text>
                  <Text style={{ lineHeight: 1.3 }}>{skills.map(s => s.nombre).join(", ")}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
