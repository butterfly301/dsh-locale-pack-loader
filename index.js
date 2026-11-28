import { createRequire } from 'node:module';
import { join } from 'node:path';

const localRequire = createRequire(import.meta.url);
const hostRoot = process.env.DSH_INSTALL_DIR
  ?? (process.resourcesPath && join(process.resourcesPath, 'app.asar', 'dsh', 'node_modules', '@deepseek-ai', 'dsh'));
const schemastery = hostRoot
  ? createRequire(join(hostRoot, 'package.json'))('@deepseek-ai/schemastery')
  : localRequire('@deepseek-ai/schemastery');
const z = schemastery.default ?? schemastery;
const localeId = () => z.string().pattern(/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/u).required();
const pack = z.object({
  id: localeId(),
  label: z.string().required(),
  fallback: localeId(),
  dictionaries: z.dict(z.dict(z.string())).required(),
});

export const Config = z.object({
  pack: z.union([z.const(false), pack]).default(false).volatile(),
  packs: z.array(pack).default([]).volatile(),
});

export function apply(ctx) {
  ctx.inject(['settings'], scope => scope.effect(
    () => scope.settings.configure({ auto: false }, ctx.fiber),
  ));
}
