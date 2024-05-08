<template>
  <div class="w-full flex h-full">
    <div class="flex-1 flex justify-center">
      <!-- Back -->
      <button
        class="absolute left-4 top-4 cursor-pointer hover:bg-gray-200 transition-all duration-150 px-1.5 py-1 rounded-2"
        @click="router.push('/')"
      >
        <svg
          width="8"
          height="12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m6.5 11-5-5 5-5"
            stroke="#7C838D"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Body -->
      <div class="w-2/3 max-w-[700px] pt-20 mb-24">
        <h3 class="text-gray-800">Merge name</h3>

        <Input
          @change="
            (e: any) =>
              mergeStore.setProperty({
                key: 'mergeName',
                value: e.target.value,
              })
          "
          class="mt-6 w-1/2"
          placeholder="Give a name to your merge"
        ></Input>

        <hr class="my-16" />

        <div class="flex items-baseline mb-6">
          <h3 class="text-gray-800">Merging method</h3>
          <small class="text-custom-small text-gray-500 ml-6">Required</small>
        </div>

        <div class="columns-2 gap-6">
          <Card
            :tags="['model-soup']"
            class="mb-6 cursor-pointer"
            :selected="mergeStore.selectedMergeMethod === 'model-soup'"
            @click="
              mergeStore.setProperty({
                key: 'selectedMergeMethod',
                value: 'model-soup',
              })
            "
          >
            <template #title>Linear or Model Soup</template>
            <template #description
              >Averages the weights of multiple models of the same architecture,
              also known as model soups.
            </template>
          </Card>

          <Card
            :tags="['addition-task-arithmetic']"
            class="mb-6 cursor-pointer"
            :selected="
              mergeStore.selectedMergeMethod === 'addition-task-arithmetic'
            "
            @click="
              mergeStore.setProperty({
                key: 'selectedMergeMethod',
                value: 'addition-task-arithmetic',
              })
            "
          >
            <template #title>Task Arithmetic</template>
            <template #description>
              Obtains task vectors by taking the weights of the models and
              subtracting the corresponding pre-trained weights of the base
              model. These task vectors are then added together and applied to
              the base model with an optional scaling coefficient.
            </template>
          </Card>

          <Card
            :tags="['dare-ties-merging']"
            class="mb-6 cursor-pointer"
            :selected="mergeStore.selectedMergeMethod === 'dare-ties-merging'"
            @click="
              mergeStore.setProperty({
                key: 'p',
                value: 0.5,
              });
              mergeStore.setProperty({
                key: 'selectedMergeMethod',
                value: 'dare-ties-merging',
              });
            "
          >
            <template #title>DARE</template>
            <template #description>
              Eliminates redundant weights in each model before using
              TIES-merging method.
            </template>
          </Card>

          <Card
            :tags="['slerp']"
            class="mb-6 cursor-pointer"
            :selected="mergeStore.selectedMergeMethod === 'slerp'"
            @click="
              mergeStore.setProperty({
                key: 't',
                value: 0.5,
              });
              mergeStore.setProperty({
                key: 'selectedMergeMethod',
                value: 'slerp',
              });
            "
          >
            <template #title>SLERP</template>
            <template #description>
              Smoothly interpolates between two sets of model weights, allowing
              for a gradual transition from one set of weights to another.
              Limited to 2 models at a time. Base model should be selected.
            </template>
          </Card>
          <Card
            :tags="['ties-merging']"
            class="mb-6 cursor-pointer"
            :selected="mergeStore.selectedMergeMethod === 'ties-merging'"
            @click="
              mergeStore.setProperty({
                key: 'selectedMergeMethod',
                value: 'ties-merging',
              })
            "
          >
            <template #title>TIES-Merging</template>
            <template #description>
              Builds on the task arithmetic method. Combines task vectors that
              address the sources of interference between parameters of
              different models such as redundant weights or sign disagreements.
            </template>
          </Card>
          <!-- Passthrough is WIP -->
          <!-- <Card
            :tags="['passthrough']"
            class="mb-6 cursor-pointer"
            :selected="mergeStore.selectedMergeMethod === 'passthrough'"
            @click="
              mergeStore.setProperty({
                key: 'selectedMergeMethod',
                value: 'passthrough',
              })
            "
          >
            <template #title>Passthrough</template>
            <template #description>
              This method concatenates layers from different models, resulting
              in a model of a larger size. The resulting models are usually
              called frankenmerges.
            </template>
          </Card> -->
        </div>

        <!-- Merging method parameters -->
        <div
          v-if="
            mergeStore.selectedMergeMethod !== 'model-soup' &&
            mergeStore.selectedMergeMethod !== 'slerp'
          "
          class="gap-12 mt-14 columns-2"
        >
          <div>
            <div class="text-body text-gray-700">Top-k</div>
            <RangeInput
              class="mt-3.5"
              :min="0"
              :max="1"
              :step="0.1"
              v-model="mergeStore.topK"
              :nullable="true"
              :with-tag="true"
            />
          </div>

          <div>
            <div class="text-body text-gray-700">Scaling coefficient</div>
            <div class="mt-3.5 gap-3">
              <RangeInput
                :min="0"
                :max="1"
                :step="0.1"
                v-model="mergeStore.scalingCoefficient"
                :nullable="true"
                :with-tag="true"
              />
            </div>
          </div>
        </div>
        <!-- Method based global params -->
        <div class="w-1/2 pr-6 mt-14">
          <div v-if="mergeStore.selectedMergeMethod === 'dare-ties-merging'">
            <div class="text-body text-gray-700">p</div>
            <div class="mt-3.5">
              <RangeInput
                :min="0"
                :max="1"
                :step="0.1"
                v-model="mergeStore.p"
                :nullable="true"
                :with-tag="true"
              />
            </div>
          </div>

          <div v-if="mergeStore.selectedMergeMethod === 'slerp'">
            <div class="text-body text-gray-700">t</div>
            <div class="mt-3.5">
              <RangeInput
                :min="0"
                :max="1"
                :step="0.1"
                v-model="mergeStore.t"
                :nullable="true"
                :with-tag="true"
              />
            </div>
          </div>
        </div>
        <div class="columns-1 gap-6 mt-14">
          <hr class="my-16" />

          <div class="flex items-baseline mb-6">
            <h3 class="text-gray-800">Base model</h3>
            <small class="text-custom-small text-gray-500 ml-6">Required</small>
          </div>

          <div
            v-if="mergeStore.selectedBaseModel"
            class="flex flex-row gap-8 justify-between items-center"
          >
            <div class="w-2/3">
              <model-selector v-model="selectedBaseModel" />
            </div>
            <div class="flex flex-col pt-3">
              <div class="text-body text-gray-700">Weights</div>
              <div class="mt-3.5 flex gap-3">
                <RangeInput
                  :min="0"
                  :max="1"
                  :step="0.1"
                  v-model="mergeStore.selectedBaseModelWeight"
                  :nullable="false"
                  :with-tag="true"
                />
              </div>
            </div>
          </div>
          <model-selector v-else v-model="selectedBaseModel" />

          <hr class="my-16" />

          <div class="flex items-baseline mb-6">
            <h3 class="text-gray-800">Models</h3>
            <small class="text-custom-small text-gray-500 ml-6">Required</small>
          </div>
          <div v-for="key in secondaryModelsCount">
            <div
              v-if="selectedModels[key]"
              class="flex flex-row gap-4 justify-center items-center"
            >
              <div class="w-2/3">
                <model-selector v-model="selectedModels[key]" />
              </div>
              <div class="flex flex-col pt-3">
                <div class="text-body text-gray-700">Weights</div>
                <div class="mt-3.5 flex gap-3">
                  <RangeInput
                    :min="0"
                    :max="1"
                    :step="0.1"
                    v-model="mergeStore.selectedBaseModelWeight"
                    :nullable="false"
                    :with-tag="true"
                  />
                </div>
              </div>
            </div>
            <model-selector v-else v-model="selectedModels[key]" />
          </div>
          <div
            class="w-1/2 pr-8"
            v-if="mergeStore.selectedMergeMethod !== 'model-soup'"
          >
            <hr class="my-16" />

            <h3 class="text-gray-800">Normalize</h3>
            <Switch
              class="mt-3.5"
              :name="'normalize'"
              v-model="mergeStore.normalize"
              :options="[
                { id: 'false', label: 'False', value: false },
                { id: 'true', label: 'True', value: true },
              ]"
            />
          </div>
        </div>

        <hr class="my-16" />

        <h3 class="text-gray-800">Tokenizer</h3>
        <div class="grid grid-cols-2 gap-16 mt-6">
          <div>
            <span class="text-body text-gray-700">Tokenizer</span>
            <Switch
              class="mt-3.5"
              :name="mergeStore.tokenizer"
              :options="[
                { id: 'base', label: 'Base', value: 'base' },
                { id: 'merged', label: 'Merged', value: 'merged' },
              ]"
              v-model="mergeStore.tokenizer"
            ></Switch>
          </div>
          <div>
            <span class="text-body text-gray-700">Tokenizer method</span>
            <Switch
              class="mt-3.5"
              :name="mergeStore.tokenizerMethod"
              :options="[
                { id: 'linear', label: 'Linear', value: 'linear' },
                { id: 'slerp', label: 'Slerp', value: 'slerp', tags: ['Soon'] },
              ]"
              v-model="mergeStore.tokenizerMethod"
            ></Switch>
          </div>
        </div>
      </div>
    </div>

    <!-- sidebar -->
    <div
      class="bg-white w-1/3 px-10 pt-20 pb-10 flex flex-col sticky top-0 right-0 h-screen"
    >
      <h3 class="text-gray-800">
        {{
          mergeStore.mergeName && mergeStore.mergeName !== ""
            ? mergeStore.mergeName
            : "My merge"
        }}
      </h3>
      <hr class="my-6" />

      <div class="text-small text-gray-700 mb-2">Merge</div>
      <div class="text-extra-small text-gray-500 grid grid-cols-2 gap-2">
        Merging method
        <span class="font-mono text-gray-700">{{
          mergeStore.selectedMergeMethod
        }}</span>
        {{ mergeStore.selectedMergeMethod === "slerp" ? "t" : "Top-k" }}
        <span class="font-mono text-gray-700">
          {{
            mergeStore.selectedMergeMethod === "slerp"
              ? setEmpty(mergeStore.t)
              : setEmpty(mergeStore.topK)
          }}
        </span>
        <span v-if="mergeStore.selectedMergeMethod !== 'slerp'"
          >Scaling coefficient</span
        >
        <span
          v-if="mergeStore.selectedMergeMethod !== 'slerp'"
          class="font-mono text-gray-700"
          >{{ setEmpty(mergeStore.scalingCoefficient) }}</span
        >
        <span v-if="mergeStore.selectedMergeMethod === 'dare-ties-merging'"
          >p</span
        >
        <span
          v-if="mergeStore.selectedMergeMethod === 'dare-ties-merging'"
          class="font-mono text-gray-700"
          >{{ setEmpty(mergeStore.p) }}</span
        >
        Base model
        <span class="font-mono text-gray-700">{{
          mergeStore.selectedBaseModel &&
          (mergeStore.selectedBaseModel as any).id
        }}</span>
      </div>

      <merge-progress-popup :show="show" @closed="show = false" />

      <div class="mt-auto">
        <div
          class="bg-white rounded-lg-2 border border-gray-200 shadow-main gap-3 p-4 text-gray-500 text-extra-small flex mb-4"
          v-show="validationError"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11 2a1 1 0 0 0-2 0v6.5a.5.5 0 0 1-1 0V3a1 1 0 0 0-2 0v5.5a.5.5 0 0 1-1 0V5a1 1 0 0 0-2 0v7a7 7 0 1 0 14 0V8a1 1 0 0 0-2 0v3.5a.5.5 0 0 1-1 0V3a1 1 0 0 0-2 0v5.5a.5.5 0 0 1-1 0V2Z"
              fill="#7C838D"
            />
          </svg>
          <p>
            You need to finalize the selections before being able to run the
            merge.
          </p>
        </div>

        <Button
          class="w-full"
          @click="
            () => {
              if (
                !mergeStore.selectedMergeMethod ||
                // models should be at least 2 if no base model
                (mergeStore.selectedModels.length < 3 &&
                  !mergeStore.selectedBaseModel) ||
                // only base model selected
                (mergeStore.selectedModels.length < 2 &&
                  mergeStore.selectedBaseModel)
              ) {
                validationError = true;
                return;
              }
              mergeStore.merge();
              show = true;
            }
          "
        >
          <svg
            width="13"
            height="14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.888 1.335a.525.525 0 0 0-.904-.46l-5.95 6.65a.525.525 0 0 0 .391.875h4.6l-.913 4.265a.525.525 0 0 0 .904.46l5.95-6.65a.525.525 0 0 0-.391-.875h-4.6l.913-4.265Z"
              fill="#fff"
            />
          </svg>
          Run the merge
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "../components/Input.vue";
import Card from "../components/Card.vue";
import Button from "../components/Button.vue";
import RangeInput from "../components/RangeInput.vue";
import ModelSelector from "../components/ModelSelector/ModelSelector.vue";
import Switch from "../components/Switch.vue";
import { useMergeStore } from "../stores/merge";

import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import MergeProgressPopup from "../components/MergeProgressPopup.vue";

const validationError = ref<boolean>(false);
const show = ref<boolean>(false);
const router = useRouter();
const mergeStore = useMergeStore();

const { selectedModels, selectedBaseModel } = storeToRefs(mergeStore);
const secondaryModelsCount = ref<number>(1);

const setEmpty = (val: any, dflt: any = null) => (val === dflt ? "N/A" : val);

watch(
  selectedModels,
  (newVal, oldVal) => {
    const oldCount = secondaryModelsCount.value;
    secondaryModelsCount.value += newVal.length < oldVal.length ? -1 : 1;

    if (secondaryModelsCount.value > oldCount) {
      mergeStore.appendToList({
        key: "selectedModelsWeights",
        value: 0.5,
      });
    }
  },
  { deep: true }
);

watch(validationError, (newVal) => {
  if (newVal) {
    setTimeout(() => (validationError.value = false), 3000);
  }
});
</script>
<style scoped></style>
../stores/merge/merge
