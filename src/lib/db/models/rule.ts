import mongoose from "mongoose"
import { Rule } from "../../types/rule"

const ruleSchema = new mongoose.Schema<Rule>({
  id: { type: String, unique: true, sparse: true },
  userId: { type: String, default: "" },
  name: { type: String, default: "" },
  baseUrl: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  useWebView: { type: Boolean, default: false },
  version: { type: String, default: "1.0" },
  searchUrl: { type: String, default: "" },
  searchRequestMethod: { type: String, default: "get" },
  searchRequestBody: { type: Map, of: String, default: {} },
  searchRequestHeaders: {
    type: Map,
    of: String,
    default: () => ({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0",
    }),
  },
  fullSearchUrl: { type: Boolean, default: false },
  timeout: { type: Number, default: 5 },
  searchSelector: { type: String, default: "" },
  itemImgSelector: { type: String, default: "" },
  itemImgFromSrc: { type: Boolean, default: true },
  itemTitleSelector: { type: String, default: "" },
  itemIdSelector: { type: String, default: "" },
  itemGenreSelector: { type: String, default: "" },
  detailUrl: { type: String, default: "" },
  detailRequestMethod: { type: String, default: "get" },
  detailRequestBody: { type: Map, of: String, default: {} },
  detailRequestHeaders: {
    type: Map,
    of: String,
    default: () => ({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0",
    }),
  },
  fullDetailUrl: { type: Boolean, default: false },
  lineSelector: { type: String, default: "" },
  episodeSelector: { type: String, default: "" },
  episodeReverse: { type: Boolean, default: false },
  playerUrl: { type: String, default: "" },
  playerRequestMethod: { type: String, default: "get" },
  playerRequestBody: { type: Map, of: String, default: {} },
  playerRequestHeaders: {
    type: Map,
    of: String,
    default: () => ({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0",
    }),
  },
  fullPlayerUrl: { type: Boolean, default: false },
  playerVideoSelector: { type: String, default: "" },
  videoElementAttribute: { type: String, default: "" },
  embedVideoSelector: { type: String, default: "" },
  waitForMediaElement: { type: Boolean, default: true },
  videoUrlSubsChar: { type: String, default: "" },
  updateAt: { type: String, default: () => new Date().toISOString() },
  isEnabled: { type: Boolean, default: true },
  isLocal: { type: Boolean, default: true },
})

export const RuleModel = mongoose.model<Rule>("Rule", ruleSchema, "rule")
