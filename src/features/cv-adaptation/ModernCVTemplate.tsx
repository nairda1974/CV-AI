import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

export function ModernCVTemplate({ cvData, themeColor = "#4F46E5" }: { cvData: CVProfile, themeColor?: string }) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      padding: 0,
      fontSize: 8,
      fontFamily: "Helvetica",
      color: "#334155",
    },
    leftColumn: {
      width: "65%",
      padding: 25,
      paddingRight: 15,
    },
    rightColumn: {
      width: "35%",
      backgroundColor: "#F8FAFC",
      padding: 25,
      paddingLeft: 15,
      borderLeftWidth: 1,
      borderLeftColor: "#E2E8F0",
    },
    header: {
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      marginBottom: 2,
      letterSpacing: -0.5,
    },
    puesto: {
      fontSize: 10,
      color: "#475569",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      borderBottomWidth: 1,
      borderBottomColor: themeColor,
      paddingBottom: 2,
      marginBottom: 6,
      marginTop: 10,
      color: themeColor,
      textTransform: "uppercase",
    },
    itemTitle: {
      fontFamily: "Helvetica-Bold",
      fontSize: 9,
      color: "#0F172A",
    },
    itemMeta: {
      fontSize: 7.5,
      color: "#64748B",
      marginBottom: 2,
      fontStyle: "italic",
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
    },
    contactItem: {
      marginBottom: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    contactLabel: {
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      width: 40,
      fontSize: 7.5,
    },
    contactValue: {
      flex: 1,
      fontSize: 7.5,
    },
    skillCategory: {
      fontFamily: "Helvetica-Bold",
      color: themeColor,
      textTransform: "uppercase",
      fontSize: 7.5,
      marginBottom: 2,
      marginTop: 6,
    },
    photoContainer: {
      marginBottom: 10,
      alignItems: "center",
    },
    photo: {
      width: 70,
      height: 70,
      borderRadius: 35,
      objectFit: "cover",
    }
  });

  const principalPuesto = cvData.experiencia[0]?.puesto || "Profesional";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.leftColumn}>
          <View style={styles.header}>
            <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
            <Text style={styles.puesto}>{principalPuesto}</Text>
          </View>

          <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
          {cvData.experiencia.map((exp, idx) => (
            <View key={idx} style={{ marginBottom: 14 }}>
              <Text style={styles.itemTitle}>{exp.puesto} — {exp.empresa}</Text>
              <Text style={styles.itemMeta}>{exp.fechaInicio} a {exp.fechaFin}</Text>
              <Text style={styles.description}>{exp.descripcion}</Text>
              {exp.logros.map((logro, lIdx) => (
                <Text key={lIdx} style={styles.bullet}>• {logro}</Text>
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitle}>Educación</Text>
          {cvData.educacion.map((edu, idx) => (
            <View key={idx} style={{ marginBottom: 10 }}>
              <Text style={styles.itemTitle}>{edu.titulo}</Text>
              <Text style={styles.itemMeta}>{edu.institucion} ({edu.fechaInicio} - {edu.fechaFin})</Text>
            </View>
          ))}
        </View>

        <View style={styles.rightColumn}>
          {cvData.datosPersonales.fotoUrl && (
            <View style={styles.photoContainer}>
              <Image src={cvData.datosPersonales.fotoUrl} style={styles.photo} />
            </View>
          )}

          <Text style={styles.sectionTitle}>Contacto</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactValue}>{cvData.datosPersonales.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Teléfono:</Text>
            <Text style={styles.contactValue}>{cvData.datosPersonales.telefono}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Ubicación:</Text>
            <Text style={styles.contactValue}>{cvData.datosPersonales.ubicacion}</Text>
          </View>
          {cvData.datosPersonales.linkedin && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>LinkedIn:</Text>
              <Text style={styles.contactValue}>{cvData.datosPersonales.linkedin}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Habilidades</Text>
          {["frontend", "backend", "database", "cloud", "devops", "soft-skill", "other"].map(
            (cat) => {
              const skillsInCat = cvData.habilidades.filter((s) => s.categoria === cat);
              if (skillsInCat.length === 0) return null;
              return (
                <View key={cat} style={{ marginBottom: 4 }}>
                  <Text style={styles.skillCategory}>
                    {cat === "soft-skill" ? "Blandas" : cat}
                  </Text>
                  {skillsInCat.map((s, sIdx) => (
                    <Text key={sIdx} style={styles.bullet}>• {s.nombre}</Text>
                  ))}
                </View>
              );
            }
          )}
        </View>
      </Page>
    </Document>
  );
}
