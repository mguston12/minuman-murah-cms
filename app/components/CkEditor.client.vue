<template>
    <div class="ck-wrap" :style="{ '--ck-min-height': minHeight || '250px' }">
        <ClientOnly>
            <Ckeditor v-model="model" :editor="ClassicEditor" :config="config" :disabled="disabled"
                :class="{ 'ck-invalid': errorMessage }" />
        </ClientOnly>
        <div v-if="errorMessage" class="text-danger small mt-1">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    CodeBlock,
    Heading,
    HeadingButtonsUI,
    BlockQuote,
    Alignment,
    HorizontalLine,
    Image,
    ImageUpload,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    Base64UploadAdapter,
    Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const props = defineProps<{
    modelValue?: string;
    placeholder?: string;
    errorMessage?: string;
    disabled?: boolean;
    minHeight?: string;
}>();
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const model = computed({
    get: () => props.modelValue ?? "",
    set: (v: string) => emit("update:modelValue", v),
});

const config = {
    licenseKey: "GPL",
    placeholder: props.placeholder,
    plugins: [
        Essentials, Paragraph, Bold, Italic, Underline, Strikethrough,
        Code, CodeBlock, Heading, HeadingButtonsUI, BlockQuote,
        Alignment, HorizontalLine,
        Image, ImageUpload, ImageToolbar, ImageCaption, ImageStyle,
        Base64UploadAdapter, Undo,
    ],
    toolbar: {
        items: [
            "bold", "italic", "underline", "strikethrough", "|",
            "heading1", "heading2", "heading3", "|",
            "blockQuote", "|",
            "code", "codeBlock", "|",
            "uploadImage", "|",
            "horizontalLine", "|",
            "alignment:left", "alignment:center", "alignment:right", "alignment:justify", "|",
            "undo", "redo",
        ],
        shouldNotGroupWhenFull: true,
    },
    heading: {
        options: [
            { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
            { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
            { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
            { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        ],
    },
    image: {
        toolbar: ["imageTextAlternative", "toggleImageCaption", "|", "imageStyle:inline", "imageStyle:block"],
    },
};
</script>

<style scoped>
.ck-wrap {
    --ck-border-radius: 6px;
    --ck-color-base-border: #dee2e6;
    --ck-color-toolbar-background: #f1f3f5;
    --ck-color-toolbar-border: #dee2e6;
    --ck-color-button-default-hover-background: #e9ecef;
    --ck-color-button-default-active-background: #dee2e6;
    --ck-color-button-on-background: #1e1e1e;
    --ck-color-button-on-hover-background: #343a40;
    --ck-color-button-on-active-background: #1e1e1e;
    --ck-color-button-on-color: #ffffff;
    --ck-color-focus-border: #adb5bd;
    --ck-color-focus-outer-shadow: transparent;
    --ck-color-engine-placeholder-text: #6c757d;
}

/* Toolbar: tombol kotak ber-border seperti Tiptap */
.ck-wrap :deep(.ck.ck-toolbar) {
    padding: 6px 8px;
}

.ck-wrap :deep(.ck.ck-toolbar .ck-button) {
    border: 1px solid #adb5bd;
    min-width: 30px;
    height: 30px;
    margin: 2px;
    justify-content: center;
}

.ck-wrap :deep(.ck.ck-toolbar .ck-button.ck-disabled) {
    border-color: #dee2e6;
}

.ck-wrap :deep(.ck.ck-toolbar .ck-button.ck-on) {
    border-color: #1e1e1e;
}

/* Sembunyikan panah dropdown di tombol code block */
.ck-wrap :deep(.ck-code-block-dropdown .ck-splitbutton__arrow) {
    display: none;
}

/* Area tulis: lebih tinggi dan font mengikuti halaman */
.ck-wrap :deep(.ck.ck-editor__editable_inline) {
    min-height: var(--ck-min-height, 250px);
    padding: 0.75rem 1rem;
}

.ck-wrap :deep(.ck.ck-content) {
    font-family: inherit;
    font-size: 0.95rem;
}

/* State error */
.ck-invalid :deep(.ck-editor__main > .ck-content) {
    border-color: #dc3545 !important;
}
</style>