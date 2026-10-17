import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const importDirectory = path.dirname(new URL(import.meta.url).pathname);
const additionsPath = path.join(importDirectory, "word_additions.tsv");
const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!baseUrl || !publicKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.");
}

const topicConfig = {
  action: { prefix: "ac", basePartOfSpeech: "verb" },
  animals: { prefix: "an", basePartOfSpeech: "noun" },
  emotions: { prefix: "em", basePartOfSpeech: "adjective" },
  space: { prefix: "sp", basePartOfSpeech: "noun" },
  sports: { prefix: "spt", basePartOfSpeech: "noun" },
  tech: { prefix: "tc", basePartOfSpeech: "noun" },
  weather: { prefix: "we", basePartOfSpeech: "noun" },
};

const dailyWordTopics = {
  v1: "action",
  v2: "action",
  v3: "action",
  v4: "action",
  v5: "action",
  v6: "action",
  v7: "action",
  v8: "action",
  v9: "action",
  v10: "action",
  v11: "emotions",
  v12: "action",
  v13: "action",
  v14: "sports",
  v15: "action",
  v16: "emotions",
  v17: "emotions",
  v18: "tech",
  v19: "tech",
  v20: "sports",
};

const weatherAdjectives = new Set([
  "sunny", "cloudy", "rainy", "stormy", "windy", "foggy", "snowy", "overcast", "humid",
  "dry", "hot", "cold", "warm", "chilly", "freezing",
]);
const spaceAdjectives = new Set(["lunar", "martian", "interstellar", "extraterrestrial"]);
const sportRoles = new Set([
  "athlete", "coach", "referee", "teammate", "opponent", "captain", "goalkeeper", "defender",
  "striker", "substitute",
]);
const sportEvents = new Set(["marathon", "triathlon", "tournament", "championship", "match", "race", "fixture"]);
const sportActivities = new Set([
  "football", "basketball", "volleyball", "tennis", "badminton", "swimming", "running", "cycling",
  "boxing", "karate", "judo", "wrestling", "golf", "table tennis", "surfing", "skiing",
  "snowboarding", "hockey", "rugby", "cricket", "archery", "fencing", "gymnastics", "weightlifting",
  "skateboarding", "climbing", "diving", "yoga",
]);

function normalizeWord(word) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

function firstMeaning(meanings) {
  return (meanings?.[0] ?? "").split(/[;,]/, 1)[0].trim();
}

function topicForExistingWord(id) {
  if (dailyWordTopics[id]) return dailyWordTopics[id];
  const prefix = id.match(/^([a-z]+)_\d+$/)?.[1];
  return Object.entries(topicConfig).find(([, config]) => config.prefix === prefix)?.[0] ?? null;
}

function inferLegacyPartOfSpeech(row, topicId) {
  const word = normalizeWord(row.word);
  if (topicId === "action") return "verb";
  if (topicId === "animals" || topicId === "sports" || topicId === "tech") return "noun";
  if (topicId === "emotions") return "adjective";
  if (topicId === "weather") return weatherAdjectives.has(word) ? "adjective" : "noun";
  if (topicId === "space") {
    if (spaceAdjectives.has(word)) return "adjective";
    if (["launch", "orbit", "alien"].includes(word)) return "verb / noun";
    return "noun";
  }
  return row.part_of_speech || "noun";
}

function inferLegacyDifficulty(id, topicId, word) {
  const number = Number(id.match(/(\d+)$/)?.[1] ?? 0);
  const simpleAnimals = new Set(["dog", "cat", "lion", "tiger", "elephant", "bear", "wolf", "fox", "rabbit", "deer", "horse", "cow", "sheep", "goat", "pig", "chicken", "duck", "eagle", "owl", "star", "planet", "comet", "rocket", "sunny", "cloudy", "rainy", "windy", "hot", "cold", "warm"]);
  if (topicId === "animals") return simpleAnimals.has(normalizeWord(word)) ? "A1" : "A2";
  if (topicId === "action") return number <= 10 ? "A2" : number <= 20 ? "B1" : "B2";
  if (topicId === "emotions") return number <= 10 ? "A2" : number <= 22 ? "B1" : "B2";
  if (topicId === "space") return number <= 10 ? "A2" : number <= 30 ? "B1" : "B2";
  if (topicId === "sports") return number <= 10 ? "A2" : number <= 22 ? "B1" : "B2";
  if (topicId === "tech") return number <= 7 ? "A1" : number <= 15 ? "A2" : number <= 23 ? "B1" : "B2";
  if (topicId === "weather") return number <= 10 ? "A1" : number <= 20 ? "A2" : "B1";
  return "B1";
}

function makePhrase(record) {
  const word = record.word;
  const meaning = firstMeaning(record.meanings);
  const topicId = record.topicId;
  if (topicId === "action") return { phrase: `learn to ${word}`, meaning: `học cách ${meaning}` };
  if (topicId === "animals") return { phrase: `wild ${word}`, meaning: `${meaning} trong môi trường hoang dã` };
  if (topicId === "emotions") return { phrase: `feel ${word}`, meaning: `cảm thấy ${meaning}` };
  if (topicId === "space") {
    if (spaceAdjectives.has(normalizeWord(word))) return { phrase: `${word} mission`, meaning: `sứ mệnh ${meaning}` };
    return { phrase: `learn about ${word}`, meaning: `tìm hiểu về ${meaning}` };
  }
  if (topicId === "sports") {
    if (sportRoles.has(normalizeWord(word))) return { phrase: `experienced ${word}`, meaning: `${meaning} có kinh nghiệm` };
    if (sportEvents.has(normalizeWord(word))) return { phrase: `prepare for a ${word}`, meaning: `chuẩn bị cho ${meaning}` };
    if (sportActivities.has(normalizeWord(word))) return { phrase: `practice ${word}`, meaning: `luyện tập ${meaning}` };
    return { phrase: `sports ${word}`, meaning: `${meaning} trong thể thao` };
  }
  if (topicId === "tech") {
    if (record.part_of_speech.includes("verb")) return { phrase: `learn to ${word}`, meaning: `học cách ${meaning}` };
    return { phrase: `use the ${word}`, meaning: `sử dụng ${meaning}` };
  }
  if (weatherAdjectives.has(normalizeWord(word))) return { phrase: `${word} weather`, meaning: `thời tiết ${meaning}` };
  return { phrase: `${word} conditions`, meaning: `điều kiện ${meaning}` };
}

function makeExample(record) {
  const word = record.word;
  const meaning = firstMeaning(record.meanings);
  const topicId = record.topicId;
  let sentence;
  let translation;

  if (topicId === "action") {
    sentence = `The team learned how to ${word} when the plan changed.`;
    translation = `Nhóm đã học cách ${meaning} khi kế hoạch thay đổi.`;
  } else if (topicId === "animals") {
    sentence = `The ${word} was featured in a wildlife documentary.`;
    translation = `Loài vật này xuất hiện trong một bộ phim tài liệu về động vật hoang dã.`;
  } else if (topicId === "emotions") {
    sentence = `She felt ${word} after hearing the news.`;
    translation = `Cô ấy cảm thấy ${meaning} sau khi nghe tin.`;
  } else if (topicId === "space") {
    if (spaceAdjectives.has(normalizeWord(word))) {
      const article = /^[aeiou]/i.test(word) ? "an" : "a";
      sentence = `The mission included ${article} ${word} study.`;
    } else {
      const noArticle = new Set(["deep space", "zero gravity", "microgravity", "mission control"]);
      const object = noArticle.has(normalizeWord(word)) ? word : `the ${word}`;
      sentence = `The scientists learned about ${object} during the mission.`;
    }
    translation = `Các nhà khoa học tìm hiểu về ${meaning} trong sứ mệnh.`;
  } else if (topicId === "sports") {
    if (sportActivities.has(normalizeWord(word))) sentence = `The athletes practiced ${word} after school.`;
    else if (sportEvents.has(normalizeWord(word))) sentence = `The team prepared for the ${word} throughout the season.`;
    else sentence = `The coach discussed the ${word} before the match.`;
    translation = `Huấn luyện viên trao đổi về ${meaning} trước buổi thi đấu.`;
  } else if (topicId === "tech") {
    if (record.part_of_speech.includes("verb")) sentence = `The technician will ${word} the software before the launch.`;
    else sentence = `The engineer tested the ${word} before deployment.`;
    translation = `Kỹ sư kiểm tra ${meaning} trước khi triển khai hệ thống.`;
  } else if (weatherAdjectives.has(normalizeWord(word))) {
    sentence = `The weather became ${word} by afternoon.`;
    translation = `Đến buổi chiều, thời tiết trở nên ${meaning}.`;
  } else {
    sentence = `The ${word} affected travel across the region.`;
    translation = `${meaning} ảnh hưởng đến việc đi lại trong khu vực.`;
  }

  return { sentence, translation };
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function csvContent(headers, rows) {
  return `${[headers, ...rows.map((row) => headers.map((header) => row[header]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n")}\r\n`;
}

function postgresTextArray(values) {
  return `{${values.map((value) => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`).join(",")}}`;
}

function stableNumber(value) {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function posGroup(partOfSpeech) {
  const value = partOfSpeech.toLowerCase();
  if (value.includes("verb")) return "verb";
  if (value.includes("adjective")) return "adjective";
  return "noun";
}

function makeQuestion(record, allRecords, sortOrder) {
  const meaning = firstMeaning(record.meanings);
  const sameLevelAndPartOfSpeech = allRecords.filter((candidate) =>
    candidate.id !== record.id &&
    candidate.difficulty === record.difficulty &&
    posGroup(candidate.part_of_speech) === posGroup(record.part_of_speech) &&
    normalizeWord(firstMeaning(candidate.meanings)) !== normalizeWord(meaning),
  );
  const samePartOfSpeech = allRecords.filter((candidate) =>
    candidate.id !== record.id &&
    posGroup(candidate.part_of_speech) === posGroup(record.part_of_speech) &&
    normalizeWord(firstMeaning(candidate.meanings)) !== normalizeWord(meaning),
  );
  const differentTopic = sameLevelAndPartOfSpeech.filter((candidate) => candidate.topicId !== record.topicId);
  const candidates = differentTopic.length >= 3
    ? differentTopic
    : sameLevelAndPartOfSpeech.length >= 3
      ? sameLevelAndPartOfSpeech
      : samePartOfSpeech;
  const pool = (candidates.length >= 3 ? candidates : allRecords.filter((candidate) =>
    candidate.id !== record.id && normalizeWord(firstMeaning(candidate.meanings)) !== normalizeWord(meaning),
  ))
    .sort((left, right) => stableNumber(`${record.id}:${left.id}`) - stableNumber(`${record.id}:${right.id}`));
  const distractors = pool.slice(0, 3).map((candidate) => candidate.word);
  if (distractors.length !== 3 || new Set([record.word, ...distractors].map(normalizeWord)).size !== 4) {
    throw new Error(`Cannot create 3 unique distractors for ${record.id} (${record.word}).`);
  }

  const options = [record.word, ...distractors]
    .sort((left, right) => stableNumber(`${record.id}:${left}`) - stableNumber(`${record.id}:${right}`));
  const sentence = makeExample(record).sentence.replace(new RegExp(record.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "____");

  return {
    id: `imp_${record.id}`,
    word_id: record.id,
    context: `Chọn từ tiếng Anh có nghĩa là “${meaning}”.`,
    sentence,
    options: postgresTextArray(options),
    correct_answer: record.word,
    sort_order: sortOrder,
  };
}

function inferTopicAndMetadata(row) {
  const topicId = topicForExistingWord(row.id);
  if (!topicId) throw new Error(`No topic mapping for existing word ${row.id} (${row.word}).`);
  const partOfSpeech = row.part_of_speech || inferLegacyPartOfSpeech(row, topicId);
  const meanings = Array.isArray(row.meanings) && row.meanings.length ? row.meanings : [row.word];
  return {
    ...row,
    part_of_speech: partOfSpeech,
    meanings,
    difficulty: row.difficulty || inferLegacyDifficulty(row.id, topicId, row.word),
    tags: Array.isArray(row.tags) ? row.tags : [topicId],
    common_phrases: Array.isArray(row.common_phrases) && row.common_phrases.length
      ? row.common_phrases
      : [makePhrase({ ...row, topicId, part_of_speech: partOfSpeech, meanings })],
    examples: Array.isArray(row.examples) && row.examples.length
      ? row.examples
      : [makeExample({ ...row, topicId, part_of_speech: partOfSpeech, meanings })],
    topicId,
  };
}

const supabase = createClient(baseUrl, publicKey);
const [vocabularyResult, questionsResult, topicsResult, linksResult] = await Promise.all([
  supabase.from("vocabulary").select("id,word,pronunciation,part_of_speech,meanings,common_phrases,examples,difficulty,tags"),
  supabase.from("exercise_questions").select("id,word_id,sort_order"),
  supabase.from("topics").select("id,name"),
  supabase.from("topic_vocabulary").select("topic_id,vocabulary_id,sort_order"),
]);
for (const result of [vocabularyResult, questionsResult, topicsResult, linksResult]) {
  if (result.error) throw new Error(result.error.message);
}

const existingVocabulary = vocabularyResult.data ?? [];
const existingQuestions = questionsResult.data ?? [];
const existingTopics = new Set((topicsResult.data ?? []).map((topic) => topic.id));
const existingLinks = linksResult.data ?? [];
if (existingVocabulary.length !== 250) {
  throw new Error(`Expected 250 current vocabulary rows before import; found ${existingVocabulary.length}. Refusing to generate mismatched files.`);
}
if (existingQuestions.length !== 20 || new Set(existingQuestions.map((row) => row.word_id)).size !== 20) {
  throw new Error("Expected exactly 20 existing exercise questions for 20 words. Review the database snapshot before generating import files.");
}

const additions = fs.readFileSync(additionsPath, "utf8").trimEnd().split(/\r?\n/).slice(1).map((line, index) => {
  const fields = line.split("\t");
  if (fields.length !== 5 || fields.some((field) => !field.trim())) throw new Error(`Invalid TSV row ${index + 2}.`);
  const [topicId, word, partOfSpeech, difficulty, meaning] = fields.map((field) => field.trim());
  if (!topicConfig[topicId] || !existingTopics.has(topicId)) throw new Error(`Topic ${topicId} does not exist in Supabase.`);
  return { topicId, word, partOfSpeech, difficulty, meanings: meaning.split(";").map((item) => item.trim()) };
});
if (additions.length !== 250) throw new Error(`Expected exactly 250 new words; found ${additions.length}.`);

const currentWords = new Set(existingVocabulary.map((row) => normalizeWord(row.word)));
for (const addition of additions) {
  const normalized = normalizeWord(addition.word);
  if (currentWords.has(normalized)) throw new Error(`Duplicate vocabulary word: ${addition.word}`);
  currentWords.add(normalized);
}

const prefixMax = new Map();
for (const row of existingVocabulary) {
  const match = row.id.match(/^([a-z]+)_(\d+)$/);
  if (match) prefixMax.set(match[1], Math.max(prefixMax.get(match[1]) ?? 0, Number(match[2])));
}
const nextIdByPrefix = new Map(prefixMax);
const newVocabulary = additions.map((addition) => {
  const prefix = topicConfig[addition.topicId].prefix;
  const nextId = (nextIdByPrefix.get(prefix) ?? 0) + 1;
  nextIdByPrefix.set(prefix, nextId);
  const row = {
    id: `${prefix}_${nextId}`,
    word: addition.word,
    pronunciation: "",
    part_of_speech: addition.partOfSpeech,
    meanings: addition.meanings,
    common_phrases: [],
    examples: [],
    difficulty: addition.difficulty,
    tags: ["supplemental", addition.topicId],
    topicId: addition.topicId,
  };
  row.common_phrases = [makePhrase(row)];
  row.examples = [makeExample(row)];
  return row;
});

const legacyEnrichment = existingVocabulary
  .filter((row) => !row.difficulty || !row.part_of_speech)
  .map(inferTopicAndMetadata);
const normalizedExisting = existingVocabulary.map((row) => {
  const enriched = legacyEnrichment.find((candidate) => candidate.id === row.id);
  const topicId = enriched?.topicId ?? topicForExistingWord(row.id);
  return enriched ?? { ...row, topicId, meanings: row.meanings ?? [], part_of_speech: row.part_of_speech ?? "noun" };
});
const allVocabulary = [...normalizedExisting, ...newVocabulary];
const vocabularyRows = [...legacyEnrichment, ...newVocabulary].map((row) => ({
  id: row.id,
  word: row.word,
  pronunciation: row.pronunciation ?? "",
  part_of_speech: row.part_of_speech,
  meanings: postgresTextArray(row.meanings),
  common_phrases: JSON.stringify(row.common_phrases),
  examples: JSON.stringify(row.examples),
  difficulty: row.difficulty,
  tags: postgresTextArray(row.tags ?? []),
}));

const topicOrder = new Map();
for (const row of existingLinks) topicOrder.set(row.topic_id, Math.max(topicOrder.get(row.topic_id) ?? 0, row.sort_order ?? 0));
const linkKeys = new Set(existingLinks.map((row) => `${row.topic_id}:${row.vocabulary_id}`));
const newTopicLinks = [];
function addTopicLink(topicId, vocabularyId) {
  const key = `${topicId}:${vocabularyId}`;
  if (linkKeys.has(key)) return;
  linkKeys.add(key);
  const sortOrder = (topicOrder.get(topicId) ?? 0) + 1;
  topicOrder.set(topicId, sortOrder);
  newTopicLinks.push({ topic_id: topicId, vocabulary_id: vocabularyId, sort_order: sortOrder });
}
for (const [id, topicId] of Object.entries(dailyWordTopics)) addTopicLink(topicId, id);
for (const row of newVocabulary) addTopicLink(row.topicId, row.id);

const questionWordIds = new Set(existingQuestions.map((row) => row.word_id));
let nextSortOrder = Math.max(0, ...existingQuestions.map((row) => row.sort_order ?? 0));
const newQuestions = allVocabulary
  .filter((row) => !questionWordIds.has(row.id))
  .sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }))
  .map((row) => makeQuestion(row, allVocabulary, ++nextSortOrder));
if (newQuestions.length !== 480) throw new Error(`Expected 480 missing questions; found ${newQuestions.length}.`);
if (vocabularyRows.length !== 480) throw new Error(`Expected 480 vocabulary upserts; found ${vocabularyRows.length}.`);
if (newTopicLinks.length !== 270) throw new Error(`Expected 270 topic links; found ${newTopicLinks.length}.`);

if (allVocabulary.length !== 500 || new Set(allVocabulary.map((row) => row.id)).size !== 500) {
  throw new Error("The merged vocabulary set must contain exactly 500 unique IDs.");
}
if (new Set(allVocabulary.map((row) => normalizeWord(row.word))).size !== 500) {
  throw new Error("The merged vocabulary set contains duplicate normalized words.");
}
if (allVocabulary.some((row) => !["A1", "A2", "B1", "B2"].includes(row.difficulty) || !row.meanings?.length || !row.common_phrases?.length || !row.examples?.length)) {
  throw new Error("Every vocabulary row must have a valid level, meaning, phrase, and example.");
}
const questionCoverage = new Set([...existingQuestions.map((row) => row.word_id), ...newQuestions.map((row) => row.word_id)]);
if (allVocabulary.some((row) => !questionCoverage.has(row.id)) || questionCoverage.size !== 500) {
  throw new Error("Every vocabulary ID must have exactly one linked exercise question.");
}
const topicCoverage = new Set([...existingLinks, ...newTopicLinks].map((row) => row.vocabulary_id));
if (allVocabulary.some((row) => !topicCoverage.has(row.id)) || topicCoverage.size !== 500) {
  throw new Error("Every vocabulary ID must be linked to a topic.");
}

function writeCsv(filename, headers, rows) {
  fs.writeFileSync(path.join(importDirectory, filename), csvContent(headers, rows), "utf8");
}

writeCsv("vocabulary.csv", ["id", "word", "pronunciation", "part_of_speech", "meanings", "common_phrases", "examples", "difficulty", "tags"], vocabularyRows);
writeCsv("exercise_questions.csv", ["id", "word_id", "context", "sentence", "options", "correct_answer", "sort_order"], newQuestions);
writeCsv("topic_vocabulary.csv", ["topic_id", "vocabulary_id", "sort_order"], newTopicLinks);

fs.writeFileSync(path.join(importDirectory, "prepare_import.sql"), `create table if not exists public.vocabulary_import_stage (id text primary key, word text not null, pronunciation text not null default '', part_of_speech text not null default '', meanings text[] not null default '{}', common_phrases jsonb not null default '[]'::jsonb, examples jsonb not null default '[]'::jsonb, difficulty text, tags text[] not null default '{}');\ncreate table if not exists public.exercise_questions_import_stage (id text primary key, word_id text not null, context text not null, sentence text not null, options text[] not null, correct_answer text not null, sort_order integer not null);\ncreate table if not exists public.topic_vocabulary_import_stage (topic_id text not null, vocabulary_id text not null, sort_order integer not null, primary key (topic_id, vocabulary_id));\nalter table public.vocabulary_import_stage enable row level security;\nalter table public.exercise_questions_import_stage enable row level security;\nalter table public.topic_vocabulary_import_stage enable row level security;\nrevoke all on public.vocabulary_import_stage, public.exercise_questions_import_stage, public.topic_vocabulary_import_stage from public, anon, authenticated;\ntruncate table public.vocabulary_import_stage, public.exercise_questions_import_stage, public.topic_vocabulary_import_stage;\n`, "utf8");

fs.writeFileSync(path.join(importDirectory, "merge_import.sql"), `begin;\ninsert into public.vocabulary (id,word,pronunciation,part_of_speech,meanings,common_phrases,examples,difficulty,tags) select id,word,pronunciation,part_of_speech,meanings,common_phrases,examples,difficulty,tags from public.vocabulary_import_stage on conflict (id) do update set word=excluded.word, pronunciation=excluded.pronunciation, part_of_speech=excluded.part_of_speech, meanings=excluded.meanings, common_phrases=excluded.common_phrases, examples=excluded.examples, difficulty=excluded.difficulty, tags=excluded.tags;\ninsert into public.exercise_questions (id,word_id,context,sentence,options,correct_answer,sort_order) select id,word_id,context,sentence,options,correct_answer,sort_order from public.exercise_questions_import_stage on conflict (id) do update set word_id=excluded.word_id, context=excluded.context, sentence=excluded.sentence, options=excluded.options, correct_answer=excluded.correct_answer, sort_order=excluded.sort_order;\ninsert into public.topic_vocabulary (topic_id,vocabulary_id,sort_order) select topic_id,vocabulary_id,sort_order from public.topic_vocabulary_import_stage on conflict (topic_id,vocabulary_id) do update set sort_order=excluded.sort_order;\ncommit;\n`, "utf8");

fs.writeFileSync(path.join(importDirectory, "validate_import.sql"), `select 'vocabulary' as table_name, count(*) as row_count from public.vocabulary union all select 'exercise_questions', count(*) from public.exercise_questions union all select 'topic_vocabulary', count(*) from public.topic_vocabulary;\nselect v.id, v.word from public.vocabulary v left join public.exercise_questions q on q.word_id=v.id group by v.id,v.word having count(q.id) <> 1;\nselect q.id,q.word_id from public.exercise_questions q left join public.vocabulary v on v.id=q.word_id where v.id is null or not (q.correct_answer = any(q.options));\nselect v.id,v.word from public.vocabulary v where v.difficulty is null or cardinality(v.meanings)=0 or jsonb_array_length(v.examples)=0 or jsonb_array_length(v.common_phrases)=0;\nselect v.id,v.word from public.vocabulary v left join public.topic_vocabulary tv on tv.vocabulary_id=v.id where tv.vocabulary_id is null;\nselect difficulty,count(*) from public.vocabulary group by difficulty order by difficulty;\nselect t.id,t.name,count(tv.vocabulary_id) as word_count from public.topics t left join public.topic_vocabulary tv on tv.topic_id=t.id group by t.id,t.name order by t.id;\n`, "utf8");

fs.appendFileSync(
  path.join(importDirectory, "prepare_import.sql"),
  "grant select, insert, update, delete on public.vocabulary_import_stage, public.exercise_questions_import_stage, public.topic_vocabulary_import_stage to service_role;\nnotify pgrst, 'reload schema';\n",
  "utf8",
);

const readmeLines = [
  "# Supabase vocabulary import",
  "",
  "This package uses stable existing word IDs to preserve foreign keys and user SRS rows. The generator only reads Supabase; it never writes to the database.",
  "",
  "## Generate",
  "",
  "From the repository root, run: node --env-file=.env.local supabase/import/generate.mjs",
  "The script uses only the public anon key and requires the current snapshot of 250 words and 20 questions.",
  "",
  "## Import in Supabase",
  "",
  "1. Run prepare_import.sql in SQL Editor. It creates locked staging tables and clears only those staging tables.",
  "2. Import vocabulary.csv into vocabulary_import_stage, exercise_questions.csv into exercise_questions_import_stage, and topic_vocabulary.csv into topic_vocabulary_import_stage using Table Editor.",
  "3. Run merge_import.sql in SQL Editor. It upserts stable keys and does not delete existing vocabulary or user progress.",
  "4. Run validate_import.sql. Expected totals are 500 words, 500 questions and 500 topic links; integrity queries should return zero rows.",
  "",
  "The 7 existing topics are reused. vocabulary.csv contains 230 enrichment updates and 250 new words. exercise_questions.csv adds one linked question for each of the 480 words without an existing question. topic_vocabulary.csv adds links for 20 Daily Learn words and 250 new words.",
];
fs.writeFileSync(path.join(importDirectory, "README.md"), `${readmeLines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  currentVocabulary: existingVocabulary.length,
  enrichedExistingWords: legacyEnrichment.length,
  newWords: newVocabulary.length,
  vocabularyUpserts: vocabularyRows.length,
  newQuestions: newQuestions.length,
  newTopicLinks: newTopicLinks.length,
  outputDirectory: importDirectory,
}, null, 2));
