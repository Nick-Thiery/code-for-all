import { ChecklistSheet, HandoutSheet, KitShell, ScriptSheet } from "@/components/kit-sheets";
import { getKit, type KitPage } from "@/lib/facilitator";

/** A session kit page: every module (module null) or just one. */
export async function KitSheets({ page, module }: { page: KitPage; module: number | null }) {
  const kit = await getKit();
  const sheets = module === null ? kit.sheets : kit.sheets.filter((sheet) => sheet.module.number === module);
  return (
    <KitShell
      page={page}
      current={module}
      modules={kit.sheets.map((sheet) => ({ number: sheet.module.number, title: sheet.module.title }))}
    >
      {sheets.map((sheet) =>
        page === "script" ? (
          <ScriptSheet key={sheet.module.number} sheet={sheet} sessionMinutes={kit.sessionMinutes} />
        ) : page === "handout" ? (
          <HandoutSheet key={sheet.module.number} sheet={sheet} />
        ) : (
          <ChecklistSheet key={sheet.module.number} sheet={sheet} />
        ),
      )}
    </KitShell>
  );
}
