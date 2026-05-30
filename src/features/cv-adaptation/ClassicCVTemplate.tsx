import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function ClassicCVTemplate({ cvData, themeColor = "#334155" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 40,
      fontSize: 10,
      fontFamily: "Times-Roman",
      color: "#000000",
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: themeColor,
      paddingBottom: 15,
    },
    name: {
      fontSize: 24,
      fontFamily: "Times-Bold",
      color: themeColor,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    contactInfo: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      fontSize: 9,
      color: "#333333",
      gap: 10,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: "Times-Bold",
      borderBottomWidth: 1,
      borderBottomColor: "#CCCCCC",
      paddingBottom: 2,
      marginBottom: 10,
      marginTop: 15,
      color: themeColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    itemBlock: {
      marginBottom: 10,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 2,
    },
    itemTitle: {
      fontFamily: "Times-Bold",
      fontSize: 11,
      color: "#000000",
    },
    itemMeta: {
      fontSize: 10,
      color: "#444444",
      fontStyle: "italic",
    },
    description: {
      marginBottom: 4,
      lineHeight: 1.3,
      color: "#222222",
      textAlign: "justify",
    },
    bullet: {
      marginLeft: 15,
      marginBottom: 3,
      lineHeight: 1.3,
    },
    skillCategory: {
      fontFamily: "Times-Bold",
      color: "#000000",
      textTransform: "capitalize",
    },
    photoContainer: {
      position: "absolute",
      top: 40,
      right: 40,
    },
    photo: {
      width: 70,
      height: 70,
      borderRadius: 4,
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {cvData.datosPersonales.fotoUrl && (
          <View style={styles.photoContainer}>
            <Image src={cvData.datosPersonales.fotoUrl} style={styles.photo} />
          </View>
        )}
        
        <View style={styles.header}>
          <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
          <View style={styles.contactInfo}>
            <Text>{cvData.datosPersonales.email}</Text>
            <Text>|</Text>
            <Text>{cvData.datosPersonales.telefono}</Text>
            <Text>|</Text>
            <Text>{cvData.datosPersonales.ubicacion}</Text>
            {cvData.datosPersonales.linkedin && (
               <>
                 <Text>|</Text>
                 <Text>{cvData.datosPersonales.linkedin}</Text>
               </>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
        {cvData.experiencia.map((exp, idx) => (
          <View key={idx} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{exp.puesto} en {exp.empresa}</Text>
              <Text style={styles.itemMeta}>{exp.fechaInicio} - {exp.fechaFin}</Text>
            </View>
            <Text style={styles.description}>{exp.descripcion}</Text>
            {exp.logros.map((logro, lIdx) => (
              <Text key={lIdx} style={styles.bullet}>• {logro}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Educación</Text>
        {cvData.educacion.map((edu, idx) => (
          <View key={idx} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{edu.titulo}</Text>
              <Text style={styles.itemMeta}>{edu.fechaInicio} - {edu.fechaFin}</Text>
            </View>
            <Text style={styles.description}>{edu.institucion}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Habilidades</Text>
        {["frontend", "backend", "database", "cloud", "devops", "soft-skill", "other"].map(
          (cat) => {
            const skillsInCat = cvData.habilidades.filter((s) => s.categoria === cat);
            if (skillsInCat.length === 0) return null;
            return (
              <View key={cat} style={{ flexDirection: "row", marginBottom: 4, flexWrap: "wrap", paddingRight: 30 }}>
                <Text style={styles.skillCategory}>
                  {cat === "soft-skill" ? "Blandas" : cat}:{" "}
                </Text>
                <Text style={{ flex: 1, lineHeight: 1.4 }}>{skillsInCat.map(s => s.nombre).join(", ")}</Text>
              </View>
            );
          }
        )}
      </Page>
    </Document>
  );
}
