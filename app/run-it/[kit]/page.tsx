import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KitSheets } from "@/components/kit-page";
import { KIT_PAGES, type KitPage } from "@/lib/facilitator";

type Props = { params: Promise<{ kit: string }> };

// /run-it/script, /run-it/handout and /run-it/checklist: every module on one
// page, each starting on a new page when printed.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(KIT_PAGES).map((kit) => ({ kit }));
}

function isKitPage(kit: string): kit is KitPage {
  return Object.hasOwn(KIT_PAGES, kit);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kit } = await params;
  if (!isKitPage(kit)) return {};
  const info = KIT_PAGES[kit];
  return { title: info.title, description: `${info.description} Every module, ready to print.` };
}

export default async function KitAllModulesPage({ params }: Props) {
  const { kit } = await params;
  if (!isKitPage(kit)) notFound();
  return <KitSheets page={kit} module={null} />;
}
