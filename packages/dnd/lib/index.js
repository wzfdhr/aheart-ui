"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
;/* empty css           */
const draggable_vue_vue_type_script_setup_true_lang = require("./draggable.vue.js");
const dropZone_vue_vue_type_script_setup_true_lang = require("./drop-zone.vue.js");
const dragOverlay_vue_vue_type_script_setup_true_lang = require("./drag-overlay.vue.js");
const sortableItem_vue_vue_type_script_setup_true_lang = require("./sortable-item.vue.js");
const sortableList_vue_vue_type_script_setup_true_lang = require("./sortable-list.vue.js");
const useDraggable = require("./use-draggable.js");
const useDroppable = require("./use-droppable.js");
const useSortable = require("./use-sortable.js");
const AheartDnd = {
  install(app) {
    app.component("ADraggable", draggable_vue_vue_type_script_setup_true_lang.default);
    app.component("ADropZone", dropZone_vue_vue_type_script_setup_true_lang.default);
    app.component("ADragOverlay", dragOverlay_vue_vue_type_script_setup_true_lang.default);
    app.component("ASortableItem", sortableItem_vue_vue_type_script_setup_true_lang.default);
    app.component("ASortableList", sortableList_vue_vue_type_script_setup_true_lang.default);
  }
};
exports.Draggable = draggable_vue_vue_type_script_setup_true_lang.default;
exports.DropZone = dropZone_vue_vue_type_script_setup_true_lang.default;
exports.DragOverlay = dragOverlay_vue_vue_type_script_setup_true_lang.default;
exports.SortableItem = sortableItem_vue_vue_type_script_setup_true_lang.default;
exports.SortableList = sortableList_vue_vue_type_script_setup_true_lang.default;
exports.useDraggable = useDraggable.useDraggable;
exports.useDroppable = useDroppable.useDroppable;
exports.useSortable = useSortable.useSortable;
exports.default = AheartDnd;
