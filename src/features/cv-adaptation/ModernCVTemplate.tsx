import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { CVProfile } from "@/schemas/cv-profile.schema";

// Registramos fuentes por defecto o estándar para evitar problemas con UTF-8
// @react-pdf/renderer ya incluye fuentes estándar (Helvetica, Times, Courier),
// pero podemos usarlas sin problemas.
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#334155",
  },
  leftColumn: {
    width: "65%",
    paddingRight: 20,
  },
  rightColumn: {
    width: "35%",
    borderLeftWidth: 1,
    borderLeftColor: "#E2E8F0",
    paddingLeft: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  puesto: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
    paddingBottom: 3,
    marginBottom: 8,
    marginTop: 14,
    color: "#0F172A",
    textTransform: "uppercase",
  },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#1E293B",
  },
  itemMeta: {
    fontSize: 8.5,
    color: "#64748B",
    marginBottom: 4,
  },
  description: {
    marginBottom: 6,
    lineHeight: 1.3,
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 3,
    lineHeight: 1.3,
  },
  contactItem: {
    marginBottom: 4,
  },
  contactLabel: {
    fontFamily: "Helvetica-Bold",
    color: "#475569",
  },
  skillBadge: {
    marginBottom: 3,
  },
});

export function ModernCVTemplate({ cvData }: { cvData: CVProfile }) {
  // Obtener el primer puesto para usarlo como subtítulo principal
  const principalPuesto = cvData.experiencia[0]?.puesto || "Profesional";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Columna Izquierda: Datos Personales, Experiencia, Educación */}
        <View style={styles.leftColumn}>
          <View style={styles.header}>
            <Text style={styles.name}>{cvData.datosPersonales.nombre}</Text>
            <Text style={styles.puesto}>{principalPuesto}</Text>
          </View>

          <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
          {cvData.experiencia.map((exp, idx) => (
            <View key={idx} style={{ marginBottom: 12 }}>
              <Text style={styles.itemTitle}>
                {exp.puesto} — {exp.empresa}
              </Text>
              <Text style={styles.itemMeta}>
                {exp.fechaInicio} a {exp.fechaFin}
              </Text>
              <Text style={styles.description}>{exp.descripcion}</Text>
              {exp.logros.map((logro, lIdx) => (
                <Text key={lIdx} style={styles.bullet}>
                  • {logro}
                </Text>
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitle}>Educación</Text>
          {cvData.educacion.map((edu, idx) => (
            <View key={idx} style={{ marginBottom: 8 }}>
              <Text style={styles.itemTitle}>{edu.titulo}</Text>
              <Text style={styles.itemMeta}>
                {edu.institucion} ({edu.fechaInicio} - {edu.fechaFin})
              </Text>
            </View>
          ))}
        </View>

        {/* Columna Derecha: Foto (opcional), Información de Contacto, Habilidades */}
        <View style={styles.rightColumn}>
          {/* Contacto */}
          <Text style={styles.sectionTitle}>Contacto</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text>{cvData.datosPersonales.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Teléfono:</Text>
            <Text>{cvData.datosPersonales.telefono}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Ubicación:</Text>
            <Text>{cvData.datosPersonales.ubicacion}</Text>
          </View>
          {cvData.datosPersonales.linkedin && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>LinkedIn:</Text>
              <Text>{cvData.datosPersonales.linkedin}</Text>
            </View>
          )}
          {cvData.datosPersonales.github && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>GitHub:</Text>
              <Text>{cvData.datosPersonales.github}</Text>
            </View>
          )}
          {cvData.datosPersonales.portfolio && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Portfolio:</Text>
              <Text>{cvData.datosPersonales.portfolio}</Text>
            </View>
          )}

          {/* Habilidades por categoría */}
          <Text style={styles.sectionTitle}>Habilidades</Text>
          
          {/* Agrupamos habilidades por categoría */}
          {["frontend", "backend", "database", "cloud", "devops", "soft-skill", "other"].map(
            (cat) => {
              const skillsInCat = cvData.habilidades.filter((s) => s.categoria === cat);
              if (skillsInCat.length === 0) return null;

              return (
                <View key={cat} style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", color: "#475569", textTransform: "capitalize", fontSize: 8, marginBottom: 2 }}>
                    {cat === "soft-skill" ? "Blandas" : cat}
                  </Text>
                  {skillsInCat.map((s, sIdx) => (
                    <Text key={sIdx} style={styles.skillBadge}>
                      • {s.nombre}
                    </Text>
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
