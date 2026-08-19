import type { Metadata } from "next";
import { DiscoverApp } from "../components/DiscoverApp";

export const metadata: Metadata = {
  title: "Discover people & skills — YUNO",
  description: "Meet YUNO members who teach the skills you want to learn.",
};

export default function DiscoverPage() {
  return <DiscoverApp />;
}
