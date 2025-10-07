import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Search, X } from "lucide-react";

type SearchRecord = {
  slug: string;
  title: string;
  description: string;
  group: string;
  tags: string[];
  content: string;
  excerpt: string;
};

type PreparedRecord = SearchRecord & {
  haystack: string;
  titleLower: string;
  descriptionLower: string;
  tagsLower: string[];
  contentLower: string;
};

type SearchHit = {
  slug: string;
  title: string;
  description: string;
  group: string;
  snippet: string;
  tags: string[];
  score: number;
};

function prepareRecord(record: SearchRecord): PreparedRecord {
  const titleLower = record.title.toLowerCase();
  const descriptionLower = record.description.toLowerCase();
  const tagsLower = record.tags.map((tag) => tag.toLowerCase());
  const contentLower = record.content.toLowerCase();
  const haystack = [
    titleLower,
    descriptionLower,
    tagsLower.join(" "),
    contentLower,
  ].join(" ");

  return {
    ...record,
    haystack,
    titleLower,
    descriptionLower,
    tagsLower,
    contentLower,
  };
}

function buildSnippet(content: string, terms: string[]): string {
  if (!content) return "";
  const lower = content.toLowerCase();

  for (const term of terms) {
    const index = lower.indexOf(term);
    if (index !== -1) {
      const start = Math.max(0, index - 60);
      const end = Math.min(content.length, index + term.length + 80);
      let snippet = content.slice(start, end).trim();
      if (start > 0) snippet = `…${snippet}`;
      if (end < content.length) snippet = `${snippet}…`;
      return snippet;
    }
  }

  const fallback = content.slice(0, 120).trim();
  return fallback && fallback.length < content.length
    ? `${fallback}…`
    : fallback;
}

function scoreMatch(record: PreparedRecord, terms: string[]): number {
  let score = 0;
  for (const term of terms) {
    if (record.titleLower.includes(term)) score += 8;
    if (record.descriptionLower.includes(term)) score += 4;
    if (record.tagsLower.some((tag) => tag.includes(term))) score += 5;

    const occurrences = record.contentLower.split(term).length - 1;
    score += occurrences;
  }
  return score;
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<PreparedRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      try {
        const response = await fetch("/search-index.json");
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data: SearchRecord[] = await response.json();
        if (!cancelled) {
          setRecords(data.map(prepareRecord));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Unknown error"
          );
        }
      }
    }

    loadIndex();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmedQuery = query.trim();
  const terms = useMemo(
    () => trimmedQuery.toLowerCase().split(/\s+/).filter(Boolean),
    [trimmedQuery]
  );

  const results = useMemo(() => {
    if (!terms.length) return [] as SearchHit[];

    return records
      .map((record) => {
        if (!terms.every((term) => record.haystack.includes(term))) return null;
        const score = scoreMatch(record, terms);
        if (score <= 0) return null;

        return {
          slug: record.slug,
          title: record.title,
          description: record.description,
          group: record.group,
          tags: record.tags,
          snippet: buildSnippet(record.content, terms),
          score,
        } satisfies SearchHit;
      })
      .filter((hit): hit is SearchHit => Boolean(hit))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [records, terms]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const showResults = isOpen && trimmedQuery.length > 0;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) {
        setIsOpen(false);
        window.location.assign(target.slug);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative hidden items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:flex"
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      <input
        ref={inputRef}
        id="handbook-search"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          setIsOpen(nextValue.trim().length > 0);
        }}
        onFocus={() => {
          if (query.trim().length > 0) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className="w-40 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
        autoComplete="off"
        spellCheck={false}
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setIsOpen(false);
            inputRef.current?.focus();
          }}
          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors absolute right-8 top-0 bottom-0 my-auto p-2"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <kbd className="hidden rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:inline">
        /
      </kbd>

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <ul className="max-h-96 overflow-y-auto p-2">
            {results.map((result, index) => (
              <li key={result.slug}>
                <a
                  href={result.slug}
                  className={`block px-4 py-2 text-sm transition-colors rounded-sm ${
                    index === activeIndex
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setIsOpen(false);
                    window.location.assign(result.slug);
                  }}
                >
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {result.title}
                  </div>
                  <div className="mt-1 text-ellipsis line-clamp-2">
                    {result.description}
                    {result.snippet || result.description || result.group}
                  </div>
                </a>
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No results
            </div>
          )}
        </div>
      )}

      {error && !records.length && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 shadow dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-200">
          Failed to load search index: {error}
        </div>
      )}
    </div>
  );
}
