import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function CreativeCVTemplate({ cvData, themeColor = "#E11D48" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 0,
      fontSize: 9,
      fontFamily: "Helvetica",
      color: "#334155",
    },
    topBanner: {
      backgroundColor: themeColor,
      padding: 40,
      flexDirection: "row",
      color: "#FFFFFF",
      alignItems: "center",
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontSize: 28,
      fontFamily: "Helvetica-Bold",
      color: "#FFFFFF",
      marginBottom: 5,
      letterSpacing: -1,
    },
    puesto: {
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    photo: {
      width: 90,
      height: 90,
      borderRadius: 45,
      border: "3px solid #FFFFFF",
      marginLeft: 20,
      objectFit: "cover",
    },
    mainContent: {
      flexDirection: "row",
      flex: 1,
    },
    leftCol: {
      width: "35%",
      backgroundColor: "#F1F5F9",
      padding: 30,
    },
    rightCol: {
      width: "65%",
      padding: 30,
    },
    sectionTitleLeft: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      textTransform: "uppercase",
      marginBottom: 10,
      marginTop: 20,
      letterSpacing: 1,
    },
    sectionTitleRight: {
      fontSize: 14,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      textTransform: "uppercase",
      borderBottomWidth: 2,
      borderBottomColor: themeColor,
      paddingBottom: 4,
      marginBottom: 15,
      marginTop: 20,
      letterSpacing: 1,
    },
    contactItem: {
      marginBottom: 8,
    },
    contactLabel: {
      fontFamily: "Helvetica-Bold",
      color: "#475569",
      fontSize: 8,
      marginBottom: 2,
    },
    contactValue: {
      fontSize: 9,
      color: "#0F172A",
    },
    skillBadge: {
      backgroundColor: themeColor,
      color: "#FFFFFF",
      padding: "4 8",
      borderRadius: 10,
      fontSize: 8,
      marginBottom: 6,
      marginRight: 6,
      alignSelf: "flex-start",
    },
    skillContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    itemBlock: {
      marginBottom: 15,
    },
    itemTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 12,
      color: "#0F172A",
      marginBottom: 2,
    },
    itemMeta: {
      fontSize: 9,
      color: "#64748B",
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    description: {
      marginBottom: 6,
      lineHeight: 1.4,
      color: "#334155",
    },
    bullet: {
      marginLeft: 10,
      marginBottom: 4,
      lineHeight: 1.4,
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
