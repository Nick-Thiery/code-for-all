import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KitSheets } from "@/components/kit-page";
import { KIT_PAGES, getKit, getRunSheet, type KitPage } from "@/lib/facilitator";
import { parseModuleParam } from "@/lib/lessons";

type Props = { params: Promise<{ kit: string; module: string }> };

// /run-it/script/module-3 and so on: one module, ready to print.
export const dynamicParams = false;

export async function generateStaticParams() {
  const { sheets } = await getKit();
  return Object.keys(KIT_PAGES).flatMap((kit) =>
    sheets.map((sheet) => ({ kit, module: `module-${sheet.module.number}` })),
  );
}

async function find(params: Props["params"]) {
  const { kit, module } = await params;
  const number = parseModuleParam(module);
  if (!Object.hasOwn(KIT_PAGES, kit) || number === null) return null;
  const sheet = await getRunSheet(number);
  return sheet ? { kit: kit as KitPage, sheet } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await find(params);
  if (!found) return {};
  const { number, title } = found.sheet.module;
  const info = KIT_PAGES[found.kit];
  return {
    title: `${info.title}: Module ${number}`,
    description: `${info.title} for Module ${number}, ${title}. ${info.description}`,
  };
}

export default async function KitModulePage({ params }: Props) {
  const found = await find(params);
  if (!found) notFound();
  return <KitSheets page={found.kit} module={found.sheet.module.number} />;
}
