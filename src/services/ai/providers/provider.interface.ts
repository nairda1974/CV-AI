import { CVProfile } from "@/schemas/cv-profile.schema";

export interface AIProvider {
  extractProfile(text: string): Promise<{ object: CVProfile; usage: any; modelUsed: string }>;
  adaptCV(profile: CVProfile, jobDescription: string): Promise<{ object: CVProfile; usage: any; modelUsed: string }>;
}
