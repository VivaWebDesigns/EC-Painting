import { useEffect, useId } from "react";
import type { JsonLdObject } from "@/lib/structured-data";

interface JsonLdProps {
  schemas: (JsonLdObject | null | undefined)[];
}

export function JsonLd({ schemas }: JsonLdProps) {
  const uid = useId().replace(/:/g, "");
  const valid = schemas.filter((s): s is JsonLdObject => !!s);

  useEffect(() => {
    if (valid.length === 0) return;

    const schemaTypeKeys = new Set(valid.flatMap(getSchemaTypeKeys));
    const existingPageSchemaScripts = Array.from(
      document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
    ).filter((script) => {
      try {
        const schema = JSON.parse(script.textContent || "{}") as JsonLdObject;
        return getSchemaTypeKeys(schema).some((type) => schemaTypeKeys.has(type));
      } catch {
        return false;
      }
    });
    const existingSchemas = existingPageSchemaScripts.flatMap((script) => {
      try {
        return [JSON.parse(script.textContent || "{}") as JsonLdObject];
      } catch {
        return [];
      }
    });
    const missingSchemas = valid.filter(
      (schema) => !existingSchemas.some((existing) => schemasMatch(existing, schema)),
    );

    if (missingSchemas.length === 0) return;

    existingPageSchemaScripts.forEach((script) => script.remove());

    const scripts: HTMLScriptElement[] = valid.map((schema, i) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = `ld-json-${uid}-${i}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [JSON.stringify(valid), uid]);

  return null;
}

function getSchemaTypeKeys(schema: JsonLdObject) {
  const type = schema["@type"];
  if (Array.isArray(type)) return type.filter((entry): entry is string => typeof entry === "string");
  return typeof type === "string" ? [type] : [];
}

function schemasMatch(a: JsonLdObject, b: JsonLdObject) {
  return stableStringify(a) === stableStringify(b);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
