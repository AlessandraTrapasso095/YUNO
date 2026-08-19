import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";

export const metadata: Metadata = {
  title: "YUNO — Teach what you know. Learn what you want.",
  description: "Meet people through skills. Teach what you know, earn Skill Hours, and learn anything from the YUNO community.",
};

export default function Home() {
  return <HomePage />;
}
