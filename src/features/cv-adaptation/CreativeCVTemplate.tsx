import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function CreativeCVTemplate({ cvData, themeColor = "#E11D48" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 0,
      fontSize: 8,
      fontFamily: "Helvetica",
      color: "#334155",
    },
    topBanner: {
      backgroundColor: themeColor,
      padding: 25,
      paddingTop: 30,
      paddingBottom: 30,
      flexDirection: "row",
      color: "#FFFFFF",
      alignItems: "center",
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontSize: 22,
      fontFamily: "Helvetica-Bold",
      color: "#FFFFFF",
      marginBottom: 3,
      letterSpacing: -0.5,
    },
    puesto: {
      fontSize: 10,
      color: "rgba(255,255,255,0.9)",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    photo: {
      width: 70,
      height: 70,
      borderRadius: 35,
      border: "2px solid #FFFFFF",
      marginLeft: 15,
      objectFit: "cover",
    },
    mainContent: {
      flexDirection: "row",
      flex: 1,
    },
    leftCol: {
      width: "35%",
      backgroundColor: "#F1F5F9",
      padding: 20,
    },
    rightCol: {
      width: "65%",
      padding: 20,
    },
    sectionTitleLeft: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      textTransform: "uppercase",
      marginBottom: 6,
      marginTop: 12,
      letterSpacing: 0.5,
    },
    sectionTitleRight: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      textTransform: "uppercase",
      borderBottomWidth: 1,
      borderBottomColor: themeColor,
      paddingBottom: 3,
      marginBottom: 8,
      marginTop: 12,
      letterSpacing: 0.5,
    },
    contactItem: {
      marginBottom: 5,
    },
    contactLabel: {
      fontFamily: "Helvetica-Bold",
      color: "#475569",
      fontSize: 7,
      marginBottom: 1,
    },
    contactValue: {
      fontSize: 8,
      color: "#0F172A",
    },
    skillBadge: {
      backgroundColor: themeColor,
      color: "#FFFFFF",
      padding: "2 6",
      borderRadius: 8,
      fontSize: 7,
      marginBottom: 4,
      marginRight: 4,
      alignSelf: "flex-start",
    },
    skillContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    itemBlock: {
      marginBottom: 8,
    },
    itemTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 10,
      color: "#0F172A",
      marginBottom: 1,
    },
    itemMeta: {
      fontSize: 8,
      color: "#64748B",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    description: {
      marginBottom: 3,
      lineHeight: 1.2,
      color: "#334155",
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 2,
      lineHeight: 1.2,
    }
  });

  const principalPuesto = cvData.experiencia[0]?.puesto || "Profesional";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Banner Superior */}
        <View style={styles.topBanner}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
            <Text style={styles.puesto}>{principalPuesto}</Text>
          </View>
          {cvData.datosPersonales.fotoUrl && (
            <Image src={cvData.datosPersonales.fotoUrl} style={styles.photo} />
          )}
        </View>

        <View style={styles.mainContent}>
          {/* Columna Izquierda (Contacto y Skills) */}
          <View style={styles.leftCol}>
            <Text style={{...styles.sectionTitleLeft, marginTop: 0}}>Contacto</Text>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{cvData.datosPersonales.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>{cvData.datosPersonales.telefono}</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Ubicación</Text>
              <Text style={styles.contactValue}>{cvData.datosPersonales.ubicacion}</Text>
            </View>
            {cvData.datosPersonales.linkedin && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>LinkedIn</Text>
                <Text style={styles.contactValue}>{cvData.datosPersonales.linkedin}</Text>
              </View>
            )}
            {cvData.datosPersonales.portfolio && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Portfolio</Text>
                <Text style={styles.contactValue}>{cvData.datosPersonales.portfolio}</Text>
              </View>
            )}

            <Text style={styles.sectionTitleLeft}>Skills Tech</Text>
            <View style={styles.skillContainer}>
              {cvData.habilidades.filter(s => s.categoria !== "soft-skill").map((skill, idx) => (
                <Text key={idx} style={styles.skillBadge}>{skill.nombre}</Text>
              ))}
            </View>

            <Text style={styles.sectionTitleLeft}>Soft Skills</Text>
            <View style={styles.skillContainer}>
              {cvData.habilidades.filter(s => s.categoria === "soft-skill").map((skill, idx) => (
                <Text key={idx} style={styles.skillBadge}>{skill.nombre}</Text>
              ))}
            </View>
          </View>

          {/* Columna Derecha (Experiencia y Educación) */}
          <View style={styles.rightCol}>
            <Text style={{...styles.sectionTitleRight, marginTop: 0}}>Experiencia</Text>
            {cvData.experiencia.map((exp, idx) => (
              <View key={idx} style={styles.itemBlock}>
                <Text style={styles.itemTitle}>{exp.puesto}</Text>
                <Text style={styles.itemMeta}>{exp.empresa} | {exp.fechaInicio} - {exp.fechaFin}</Text>
                <Text style={styles.description}>{exp.descripcion}</Text>
                {exp.logros.map((logro, lIdx) => (
                  <Text key={lIdx} style={styles.bullet}>• {logro}</Text>
                ))}
              </View>
            ))}

            <Text style={styles.sectionTitleRight}>Educación</Text>
            {cvData.educacion.map((edu, idx) => (
              <View key={idx} style={styles.itemBlock}>
                <Text style={styles.itemTitle}>{edu.titulo}</Text>
                <Text style={styles.itemMeta}>{edu.institucion} | {edu.fechaInicio} - {edu.fechaFin}</Text>
              </View>
            ))}
          </View>
        </View>

      </Page>
    </Document>
  );
}
