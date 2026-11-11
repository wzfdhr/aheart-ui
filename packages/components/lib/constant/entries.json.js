"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const base = [
  {
    name: "Button",
    subpath: "button",
    sourceEntry: "src/button/index.ts",
    styles: [
      "button/style.css",
      "icon/style.css"
    ]
  },
  {
    name: "Combobox",
    subpath: "combobox",
    sourceEntry: "src/combobox/index.ts",
    styles: [
      "utils/floating.css",
      "combobox/style.css"
    ]
  },
  {
    name: "Modal",
    subpath: "modal",
    sourceEntry: "src/modal/index.ts",
    styles: [
      "button/style.css",
      "icon/style.css",
      "modal/style.css",
      "skeleton/style.css"
    ]
  },
  {
    name: "Select",
    subpath: "select",
    sourceEntry: "src/select/index.ts",
    styles: [
      "icon/style.css",
      "utils/floating.css",
      "select/style.css"
    ]
  }
];
const ai = [
  {
    subpath: "actions",
    sourceEntry: "src/actions/index.ts",
    names: [
      "AIActions"
    ],
    scopes: [
      "actions"
    ]
  },
  {
    subpath: "attachments",
    sourceEntry: "src/attachments/index.ts",
    names: [
      "AIAttachments"
    ],
    scopes: [
      "attachments"
    ]
  },
  {
    subpath: "bubble",
    sourceEntry: "src/bubble/index.ts",
    names: [
      "AIBubble"
    ],
    scopes: [
      "bubble",
      "attachments",
      "process",
      "sources"
    ]
  },
  {
    subpath: "conversations",
    sourceEntry: "src/conversations/index.ts",
    names: [
      "AIConversations"
    ],
    scopes: [
      "conversations"
    ]
  },
  {
    subpath: "form",
    sourceEntry: "src/form/index.ts",
    names: [
      "AIForm"
    ],
    scopes: [
      "form",
      "visually-hidden"
    ]
  },
  {
    subpath: "process",
    sourceEntry: "src/process/index.ts",
    names: [
      "AIProcess"
    ],
    scopes: [
      "process"
    ]
  },
  {
    subpath: "prompts",
    sourceEntry: "src/prompts/index.ts",
    names: [
      "AIPrompts"
    ],
    scopes: [
      "prompts"
    ]
  },
  {
    subpath: "sender",
    sourceEntry: "src/sender/index.ts",
    names: [
      "AISender"
    ],
    scopes: [
      "sender"
    ]
  },
  {
    subpath: "sources",
    sourceEntry: "src/sources/index.ts",
    names: [
      "AISources"
    ],
    scopes: [
      "sources"
    ]
  },
  {
    subpath: "thought-chain",
    sourceEntry: "src/thought-chain/index.ts",
    names: [
      "AIThoughtChain"
    ],
    scopes: [
      "process"
    ]
  },
  {
    subpath: "welcome",
    sourceEntry: "src/welcome/index.ts",
    names: [
      "AIWelcome"
    ],
    scopes: [
      "welcome"
    ]
  },
  {
    subpath: "chat-panel",
    sourceEntry: "src/chat-panel/index.ts",
    names: [
      "AIChatPanel"
    ],
    scopes: [
      "chat-panel",
      "visually-hidden",
      "actions",
      "attachments",
      "bubble",
      "process",
      "sources",
      "conversations",
      "prompts",
      "sender",
      "welcome"
    ]
  },
  {
    subpath: "agent-workbench",
    sourceEntry: "src/agent-workbench/index.ts",
    names: [
      "AIAgentWorkbench"
    ],
    scopes: [
      "workbench",
      "chat-panel",
      "visually-hidden",
      "actions",
      "attachments",
      "bubble",
      "process",
      "sources",
      "conversations",
      "prompts",
      "sender",
      "welcome"
    ],
    sideEffects: [
      "@aheart-ui/dnd/sortable/style.css"
    ]
  },
  {
    subpath: "chat",
    sourceEntry: "src/chat/index.ts",
    names: [],
    scopes: [
      "chat-panel",
      "visually-hidden",
      "actions",
      "attachments",
      "bubble",
      "process",
      "sources",
      "conversations",
      "prompts",
      "sender",
      "welcome"
    ]
  },
  {
    subpath: "agent",
    sourceEntry: "src/agent/index.ts",
    names: [],
    scopes: [
      "process",
      "form",
      "visually-hidden"
    ]
  },
  {
    subpath: "workbench",
    output: "agent-workbench/index",
    styleOutput: "agent-workbench/style.css",
    names: []
  }
];
const dnd = [
  {
    subpath: "draggable",
    sourceEntry: "src/draggable/index.ts",
    names: [
      "Draggable"
    ],
    scopes: [
      "draggable",
      "dragging",
      "keyboard-grabbed",
      "keyboard-compatible",
      "live-region"
    ]
  },
  {
    subpath: "droppable",
    sourceEntry: "src/droppable/index.ts",
    names: [
      "DropZone"
    ],
    scopes: [
      "drop-zone",
      "dragging",
      "keyboard-grabbed",
      "keyboard-compatible",
      "live-region"
    ]
  },
  {
    subpath: "drag-overlay",
    sourceEntry: "src/drag-overlay/index.ts",
    names: [
      "DragOverlay"
    ],
    scopes: [
      "overlay"
    ]
  },
  {
    subpath: "sortable",
    sourceEntry: "src/sortable/index.ts",
    names: [
      "SortableList",
      "SortableItem"
    ],
    scopes: [
      "sortable-list",
      "sortable-item",
      "sortable-handle",
      "dragging",
      "keyboard-grabbed",
      "keyboard-compatible",
      "live-region"
    ]
  }
];
const entries = {
  base,
  ai,
  dnd
};
exports.ai = ai;
exports.base = base;
exports.default = entries;
exports.dnd = dnd;
