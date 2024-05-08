<template>
  <div
    class="flex gap-3 select-none transition-all duration-50 cursor-pointer p-4 rounded-xl hover:bg-gray-50"
  >
    <div
      class="rounded-lg-2 bg-gray-100 text-gray-500 font-semibold text-[20px] flex items-center justify-center w-14 h-14 capitalize"
    >
      {{ id[0] }}
    </div>
    <div class="flex-1">
      <div
        class="text-small text-gray-700 text-left max-w-[340px] overflow-hidden text-ellipsis mb-1"
      >
        {{ id }}
      </div>
      <div class="flex gap-4 text-extra-small text-gray-500 w-full">
        <span>{{ (pipeline_tags_names as any)[pipeline_tag] ?? "" }}</span>
        <div class="flex items-baseline gap-0.75">
          <svg
            width="10"
            height="10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.25 6.875v.938a.937.937 0 0 0 .938.937h5.624a.937.937 0 0 0 .938-.938v-.937M6.875 5 5 6.875m0 0L3.125 5M5 6.875V1.25"
              stroke="#7C838D"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ formatNumber(downloads) }}
        </div>
        <div class="flex items-baseline gap-0.75">
          <svg
            width="10"
            height="10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.75 3.438c0-1.036-.875-1.876-1.953-1.876-.807 0-1.5.47-1.797 1.14a1.957 1.957 0 0 0-1.797-1.14c-1.078 0-1.953.84-1.953 1.875 0 3.009 3.75 5 3.75 5s3.75-1.991 3.75-5Z"
              stroke="#7C838D"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ formatNumber(likes) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  pipeline_tag: string;
  downloads: number;
  likes: number;
}>();

function formatNumber(n: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

const pipeline_tags_names = {
  "image-text-to-text": "Image-Text-to-Text",
  "visual-question-answering": "Visual Question Answering",
  "document-question-answering": "Document Question Answering",
  "depth-estimation": "Depth Estimation",
  "image-classification": "Image Classification",
  "object-detection": "Object Detection",
  "image-segmentation": "Image Segmentation",
  "text-to-image": "Text-to-Image",
  "image-to-text": "Image-to-Text",
  "image-to-image": "Image-to-Image",
  "image-to-video": "Image-to-Video",
  "unconditional-image-generation": "Unconditional Image Generation",
  "video-classification": "Video Classification",
  "text-to-video": "Text-to-Video",
  "zero-shot-image-classification": "Zero-Shot Image Classification",
  "mask-generation": "Mask Generation",
  "zero-shot-object-detection": "Zero-Shot Object Detection",
  "text-to-3d": "Text-to-3D",
  "image-to-3d": "Image-to-3D",
  "image-feature-extraction": "Image Feature Extraction",
  "text-classification": "Text Classification",
  "token-classification": "Token Classification",
  "table-question-answering": "Table Question Answering",
  "question-answering": "Question Answering",
  "zero-shot-classification": "Zero-Shot Classification",
  translation: "Translation",
  summarization: "Summarization",
  "feature-extraction": "Feature Extraction",
  "text-generation": "Text Generation",
  "text2text-generation": "Text2Text Generation",
  "fill-mask": "Fill-Mask",
  "sentence-similarity": "Sentence Similarity",
  "text-to-speech": "Text-to-Speech",
  "text-to-audio": "Text-to-Audio",
  "automatic-speech-recognition": "Automatic Speech Recognition",
  "audio-to-audio": "Audio-to-Audio",
  "audio-classification": "Audio Classification",
  "voice-activity-detection": "Voice Activity Detection",
  "tabular-classification": "Tabular Classification",
  "tabular-regression": "Tabular Regression",
  "reinforcement-learning": "Reinforcement Learning",
  robotics: "Robotics",
  "graph-ml": "Graph Machine Learning",
};
</script>

<style scoped></style>
