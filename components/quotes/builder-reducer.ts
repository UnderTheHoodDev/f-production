import { makeId } from "@/lib/constants/company";
import { suggestedAmount } from "@/lib/quotes/calc";
import type {
  QuoteBlock,
  QuoteContent,
  QuoteItem,
  QuoteSection,
} from "@/lib/quotes/types";

export type BuilderState = {
  content: QuoteContent;
  discount: number;
  taxRate: number;
  issueDate: string; // YYYY-MM-DD
  validUntil: string; // YYYY-MM-DD or ""
  representativeKey: string | null;
  representativeUrl: string | null; // preview / existing signature image
};

export type BuilderAction =
  | { type: "SET_META"; field: "discount" | "taxRate"; value: number }
  | { type: "SET_DATE"; field: "issueDate" | "validUntil"; value: string }
  | { type: "SET_COMPANY"; field: keyof QuoteContent["company"]; value: string }
  | { type: "SET_RECIPIENT"; field: keyof QuoteContent["recipient"]; value: string }
  | { type: "SET_REPRESENTATIVE"; field: "name" | "title"; value: string }
  | { type: "SET_SIGNATURE"; key: string | null; url: string | null }
  | { type: "ADD_SECTION" }
  | { type: "REMOVE_SECTION"; sectionId: string }
  | { type: "RENAME_SECTION"; sectionId: string; title: string }
  | { type: "REORDER_SECTIONS"; sections: QuoteSection[] }
  | { type: "ADD_ITEM"; sectionId: string }
  | { type: "REMOVE_ITEM"; sectionId: string; itemId: string }
  | {
      type: "EDIT_ITEM";
      sectionId: string;
      itemId: string;
      patch: Partial<QuoteItem>;
    }
  | { type: "REORDER_ITEMS"; sectionId: string; items: QuoteItem[] }
  | { type: "ADD_BLOCK" }
  | { type: "REMOVE_BLOCK"; blockId: string }
  | { type: "EDIT_BLOCK"; blockId: string; patch: Partial<QuoteBlock> }
  | { type: "REORDER_BLOCKS"; blocks: QuoteBlock[] }
  | { type: "SET_FEEDBACK_PROMPT"; value: string }
  | { type: "SET_FEEDBACK_OPTIONS"; options: string[] };

export function makeItem(): QuoteItem {
  return {
    id: makeId(),
    name: "",
    unit: "",
    qty: 1,
    sessions: 1,
    unitPrice: 0,
    amount: 0,
  };
}

export function makeSection(): QuoteSection {
  return { id: makeId(), title: "", items: [makeItem()] };
}

export function makeBlock(): QuoteBlock {
  return { id: makeId(), title: "", lines: [""] };
}

const mapSections = (
  state: BuilderState,
  fn: (s: QuoteSection) => QuoteSection
): BuilderState => ({
  ...state,
  content: { ...state.content, sections: state.content.sections.map(fn) },
});

export function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case "SET_META":
      return { ...state, [action.field]: action.value };
    case "SET_DATE":
      return { ...state, [action.field]: action.value };
    case "SET_COMPANY":
      return {
        ...state,
        content: {
          ...state.content,
          company: { ...state.content.company, [action.field]: action.value },
        },
      };
    case "SET_RECIPIENT":
      return {
        ...state,
        content: {
          ...state.content,
          recipient: { ...state.content.recipient, [action.field]: action.value },
        },
      };
    case "SET_REPRESENTATIVE":
      return {
        ...state,
        content: {
          ...state.content,
          representative: {
            ...state.content.representative,
            [action.field]: action.value,
          },
        },
      };
    case "SET_SIGNATURE":
      return { ...state, representativeKey: action.key, representativeUrl: action.url };

    case "ADD_SECTION":
      return {
        ...state,
        content: {
          ...state.content,
          sections: [...state.content.sections, makeSection()],
        },
      };
    case "REMOVE_SECTION":
      return {
        ...state,
        content: {
          ...state.content,
          sections: state.content.sections.filter((s) => s.id !== action.sectionId),
        },
      };
    case "RENAME_SECTION":
      return mapSections(state, (s) =>
        s.id === action.sectionId ? { ...s, title: action.title } : s
      );
    case "REORDER_SECTIONS":
      return { ...state, content: { ...state.content, sections: action.sections } };

    case "ADD_ITEM":
      return mapSections(state, (s) =>
        s.id === action.sectionId ? { ...s, items: [...s.items, makeItem()] } : s
      );
    case "REMOVE_ITEM":
      return mapSections(state, (s) =>
        s.id === action.sectionId
          ? { ...s, items: s.items.filter((i) => i.id !== action.itemId) }
          : s
      );
    case "EDIT_ITEM":
      return mapSections(state, (s) => {
        if (s.id !== action.sectionId) return s;
        return {
          ...s,
          items: s.items.map((item) => {
            if (item.id !== action.itemId) return item;
            const next = { ...item, ...action.patch };
            // Editing amount directly = manual override (keeps the 0đ case).
            if ("amount" in action.patch) {
              next.isAmountOverridden = true;
            } else if (
              "qty" in action.patch ||
              "sessions" in action.patch ||
              "unitPrice" in action.patch
            ) {
              if (!next.isAmountOverridden) next.amount = suggestedAmount(next);
            }
            return next;
          }),
        };
      });
    case "REORDER_ITEMS":
      return mapSections(state, (s) =>
        s.id === action.sectionId ? { ...s, items: action.items } : s
      );

    case "ADD_BLOCK":
      return {
        ...state,
        content: { ...state.content, blocks: [...state.content.blocks, makeBlock()] },
      };
    case "REMOVE_BLOCK":
      return {
        ...state,
        content: {
          ...state.content,
          blocks: state.content.blocks.filter((b) => b.id !== action.blockId),
        },
      };
    case "EDIT_BLOCK":
      return {
        ...state,
        content: {
          ...state.content,
          blocks: state.content.blocks.map((b) =>
            b.id === action.blockId ? { ...b, ...action.patch } : b
          ),
        },
      };
    case "REORDER_BLOCKS":
      return { ...state, content: { ...state.content, blocks: action.blocks } };

    case "SET_FEEDBACK_PROMPT":
      return {
        ...state,
        content: {
          ...state.content,
          feedback: { ...state.content.feedback, prompt: action.value },
        },
      };
    case "SET_FEEDBACK_OPTIONS":
      return {
        ...state,
        content: {
          ...state.content,
          feedback: { ...state.content.feedback, options: action.options },
        },
      };
    default:
      return state;
  }
}
