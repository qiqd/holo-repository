import { z } from 'zod';

export const RuleSchema = z.object({
  id: z.string().optional(),
  userId: z.string().default(''),
  name: z.string().default(''),
  baseUrl: z.string().default(''),
  logoUrl: z.string().default(''),
  useWebView: z.boolean().default(false),
  version: z.string().default('1.0'),
  searchUrl: z.string().default(''),
  searchRequestMethod: z.string().default('get'),
  searchRequestBody: z.record(z.string(), z.string()).default(() => ({})),
  searchRequestHeaders: z.record(z.string(), z.string()).default(() => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0'
  })),
  fullSearchUrl: z.boolean().default(false),
  timeout: z.number().default(5),
  searchSelector: z.string().default(''),
  itemImgSelector: z.string().default(''),
  itemImgFromSrc: z.boolean().default(true),
  itemTitleSelector: z.string().default(''),
  itemIdSelector: z.string().default(''),
  itemGenreSelector: z.string().default(''),
  detailUrl: z.string().default(''),
  detailRequestMethod: z.string().default('get'),
  detailRequestBody: z.record(z.string(), z.string()).default(() => ({})),
  detailRequestHeaders: z.record(z.string(), z.string()).default(() => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0'
  })),
  fullDetailUrl: z.boolean().default(false),
  lineSelector: z.string().default(''),
  episodeSelector: z.string().default(''),
  episodeReverse: z.boolean().default(false),
  playerUrl: z.string().default(''),
  playerRequestMethod: z.string().default('get'),
  playerRequestBody: z.record(z.string(), z.string()).default(() => ({})),
  playerRequestHeaders: z.record(z.string(), z.string()).default(() => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0'
  })),
  fullPlayerUrl: z.boolean().default(false),
  playerVideoSelector: z.string().default(''),
  videoElementAttribute: z.string().default(''),
  embedVideoSelector: z.string().default(''),
  waitForMediaElement: z.boolean().default(true),
  videoUrlSubsChar: z.string().default(''),
  updateAt: z.string().default(() => new Date().toISOString()),
  isEnabled: z.boolean().default(true),
  isLocal: z.boolean().default(true)
});

export type Rule = z.infer<typeof RuleSchema>;