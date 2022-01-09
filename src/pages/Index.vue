<template>
  <div>
    <div class="properties">
      <q-input
        label="Width"
        data-testid="inputWidth"
        :value="imageProperties.width"
        @input="imageProperties.width = parseIntCustom($event, maxWidth)"
      ></q-input>
      <q-input
        label="Height"
        data-testid="inputHeight"
        :value="imageProperties.height"
        @input="imageProperties.height = parseIntCustom($event, maxHeight)"
      ></q-input>
    </div>
    <section class="categories" ref="categories">
      <div
        class="category"
        v-for="(category, index) in imageProperties.categories"
        :key="category.id"
      >
        <q-input
          :label="`Category - ${index + 1}`"
          :value="category.value"
          @input="onCategoryInput(category, category.id, $event)"
        ></q-input>
        <q-btn
          icon="delete"
          class="q-mt-md"
          :data-testid="`removeCategoryBtn-${category.id}`"
          @click="removeCategory(category.id)"
        ></q-btn>
      </div>
    </section>
    <div class="add-category-cnt">
      <q-input
        label="New category's name"
        data-testid="categoryInput"
        class="q-mb-lg"
        :value="newCategory"
        @input="newCategory = $event"
        @keypress.enter="addCategory"
      ></q-input>
    </div>
    <div class="controls q-pb-lg">
      <q-toggle :disable="!finalUrl" v-model="showImage" label="Show"></q-toggle>
      <q-btn
        label="add"
        data-testid="addCategoryField"
        @click="addCategory"
      ></q-btn>
      <q-btn v-if="showImage" :disable="!finalUrl" data-testid="refreshBtn" label="Refresh"
             @click="refreshImage"></q-btn>
    </div>
    <div class="image-cnt">
      <div
        class="image-stub"
        v-if="!finalUrl || !showImage"
        :style="{
          width: imageProperties.width + 'px',
          height: imageProperties.height + 'px',
        }"
      ></div>
      <template v-else>
        <img
          :src="finalUrl"
          :key="refreshKey"
          ref="relevantImage"
          data-tedtid="relevantImage"
          alt="The image you wanted"
        /></template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop,
} from 'vue-property-decorator';
import { ICategory, IImageProperties } from 'pages/types/types';
import { parseIntCustomHelper } from 'src/helpers/intParser';

@Component
export default class RandomPlaceholder extends Vue {
  @Prop({ type: Number, default: 100 }) readonly initialWidth!: number;

  @Prop({ type: Number, default: 122 }) readonly initialHeight!: number;

  @Prop({ type: Object, default: () => ({ value: 'Rome', id: '0' }) }) readonly initialCategory!: ICategory;

  get finalUrl() {
    if (Object.values(this.imageProperties).some((i) => !i)) return false;

    const urlWithWidthAndHeight = `${this.baseUrl}/${this.imageProperties.width}/${this.imageProperties.height}`;
    const categoriesToAttach = [
      ...this.imageProperties.categories.map((i) => i.value),
    ].join(',');

    return `${urlWithWidthAndHeight}/${categoriesToAttach}?dummy=${Date.now()}`;
  }

  get lastCategoryId() {
    return Math.max(0, ...this.imageProperties.categories.map((i) => i.id));
  }

  baseUrl = 'https://loremflickr.com';

  imageProperties: IImageProperties = {
    width: this.initialWidth,

    height: this.initialHeight,

    categories: [this.initialCategory],
  };

  newCategory = '';

  maxWidth = 1600

  maxHeight = 900

  showImage = false;

  refreshKey = 0

  addCategory() {
    if (!this.newCategory) return;
    this.imageProperties.categories.push({
      id: this.lastCategoryId + 1,
      value: this.newCategory,
    });

    this.newCategory = '';
    this.$nextTick(() => this.scrollToEnd());
  }

  removeCategory(id: number) {
    let { categories } = this.imageProperties;
    const startIndex = categories.findIndex((i) => i.id === id);
    categories = categories.filter((i) => i.id !== id);

    categories
      .slice(startIndex)
      // eslint-disable-next-line no-plusplus
      .map((i) => i.id === 0 || --i.id);

    this.imageProperties.categories = categories;
  }

  onCategoryInput(category: ICategory, id: number, newVal: string) {
    if (newVal) category.value = newVal;
    else this.removeCategory(id);
  }

  refreshImage() {
    const image = this.$refs.relevantImage as HTMLImageElement;
    if (image) {
      image.src = image.src.replace(/\?dummy=\d+/, `?dummy=${Date.now()}`);
    }
  }

  scrollToEnd() {
    const categoriesCnt = this.$refs.categories as HTMLElement;
    window.scrollTo({
      top: categoriesCnt.scrollHeight + 200,
      behavior: 'smooth',
    });
  }

  parseIntCustom = parseIntCustomHelper
}
</script>

<style scoped lang="scss">
.image-cnt {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  .image-stub {
    display: flex;
    border: 1px solid;
  }
}

.controls {
  display: flex;
  justify-content: left;
  gap: 16px;
}
</style>
