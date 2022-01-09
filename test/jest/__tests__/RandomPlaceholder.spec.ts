/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return,
 @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment  */
// @ts-nocheck
import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import Index from 'pages/Index.vue';
import { Vue } from 'vue-property-decorator';
import { QInput, QBtn, QToggle } from 'quasar';

describe('Random placeholder', () => {
  const createComponent = mountFactory(Index, {
    quasar: {
      components: { QBtn, QInput, QToggle },
    },

  });
  const findElemByTestId = (testId: string | number, wrapper) => wrapper.find(`[data-testid="${testId}"]`);

  const INITIAL_CATEGORY_VALUE = 'Rome';
  const FIRST_CATEGORY_VALUE = 'India';
  const SECOND_CATEGORY_VALUE = 'China';

  const INITIAL_WIDTH = 200;
  const INITIAL_HEIGHT = 400;
  //
  // const defaultDateNow = Date.now;
  const MOCK_DATE = 123456901;
  // global.Date.now = jest.fn(() => MOCK_DATE);
  const spy = jest
    .spyOn(Date, 'now')
    .mockReturnValue(MOCK_DATE);

  // jest.useFakeTimers('modern');
  // jest.setSystemTime(new Date('04 Dec 1995 00:12:00 GMT').getTime());
  it('mounts', () => {
    const wrapper = createComponent();
    expect(wrapper).toBeTruthy();
  });

  it.each`
    expectedBehavior           | dataObj     | initialPropName    | initialValue
    ${'passes initial width'}  | ${'width'}  | ${'initialWidth'}  | ${200}
    ${'passes initial height'} | ${'height'} | ${'initialHeight'} | ${400}
  `(
    '$expectedBehavior',
    ({ dataObj, initialPropName, initialValue }: Record<string, string | number>) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const wrapper = createComponent({
        [initialPropName]: initialValue,
      });
      expect(wrapper.vm.imageProperties[dataObj]).toBe(initialValue);
    },
  );

  it.each`
    expectedBehavior                       | inputDataId | dataObj     | initialValue | typedValue | expectedValue
    ${'let typing only numbers in width'}  | ${'Width'}  | ${'width'}  | ${100}       | ${'4a'}    | ${1004}
    ${'let typing only numbers in height'} | ${'Height'} | ${'height'} | ${40}       | ${'6ffs'}  | ${406}
  `(
    'should $expectedBehavior',
    async ({
      inputDataId, dataObj, initialValue, typedValue, expectedValue,
    }: Record<string, string | number>) => {
      const wrapper = createComponent({
        [`initial${inputDataId}`]: initialValue,
      });
      const inputField = findElemByTestId([`input${inputDataId}`], wrapper);

      inputField.vm.$emit('input', `${initialValue} + ${typedValue}`);
      await Vue.nextTick();
      expect(wrapper.vm.imageProperties[dataObj]).toBe(expectedValue);
    },
  );

  it.each`
    expectedBehavior                                   | inputDataId | dataObj     | initialValue | typedValue | maxVal
    ${'sets width to max allowed if it is > than it'}  | ${'Width'}  | ${'width'}  | ${200}       | ${2}       | ${'maxWidth'}
    ${'sets height to max allowed if it is > than it'} | ${'Height'} | ${'height'} | ${400}       | ${1}       | ${'maxHeight'}
  `(
    'should $expectedBehavior',
    async ({
      inputDataId, dataObj, initialValue, typedValue, maxVal,
    }: Record<string, string | number>) => {
      const wrapper = createComponent({
        [`initial${inputDataId}`]: initialValue,
      });
      const inputField = findElemByTestId([`input${inputDataId}`], wrapper);
      const maxValue = wrapper.vm[maxVal];

      inputField.vm.$emit('input', `${initialValue} + ${typedValue}`);
      await Vue.nextTick();
      expect(wrapper.vm.imageProperties[dataObj]).toBe(maxValue);
    },
  );

  it('correctly adds new category fields', async () => {
    const wrapper = createComponent({ initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 } });
    const categoryInput = findElemByTestId('categoryInput', wrapper);
    window.scrollTo = jest.fn();

    await Vue.nextTick();

    categoryInput.vm.$emit('input', FIRST_CATEGORY_VALUE);

    await Vue.nextTick();

    findElemByTestId('addCategoryField', wrapper).vm.$emit('click');
    categoryInput.vm.$emit('input', SECOND_CATEGORY_VALUE);
    await Vue.nextTick();

    findElemByTestId('addCategoryField', wrapper).vm.$emit('click');

    await Vue.nextTick();
    const { categories } = wrapper.vm.imageProperties;

    expect(categories[0].id).toBe(0);
    expect(categories[0].value).toBe(INITIAL_CATEGORY_VALUE);
    expect(categories[1].id).toBe(1);
    expect(categories[1].value).toBe(FIRST_CATEGORY_VALUE);
    expect(categories[2].id).toBe(2);
    expect(categories[2].value).toBe(SECOND_CATEGORY_VALUE);
  });
  it('correctly deletes category fields', async () => {
    const wrapper = createComponent({ initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 } });
    const categoryInput = findElemByTestId('categoryInput', wrapper);
    window.scrollTo = jest.fn();

    categoryInput.vm.$emit('input', FIRST_CATEGORY_VALUE);
    await Vue.nextTick();

    findElemByTestId('addCategoryField', wrapper).vm.$emit('click');

    categoryInput.vm.$emit('input', SECOND_CATEGORY_VALUE);
    await Vue.nextTick();

    findElemByTestId('addCategoryField', wrapper).vm.$emit('click');
    await Vue.nextTick();

    wrapper.find('[data-testid="removeCategoryBtn-1"]').vm.$emit('click');

    await Vue.nextTick();
    const { categories } = wrapper.vm.imageProperties;

    expect(categories[0].id).toBe(0);
    expect(categories[0].value).toBe(INITIAL_CATEGORY_VALUE);
    expect(categories[1].id).toBe(1);
    expect(categories[1].value).toBe(SECOND_CATEGORY_VALUE);
  });
  it('correctly creates final url', async () => {
    const BASE_URL = 'https://loremflickr.com';
    const wrapper = createComponent({
      initialWidth: INITIAL_WIDTH,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { id: 0, value: INITIAL_CATEGORY_VALUE },
    });
    const categoryInput = findElemByTestId('categoryInput', wrapper);
    categoryInput.vm.$emit('input', FIRST_CATEGORY_VALUE);
    await Vue.nextTick();
    findElemByTestId('addCategoryField', wrapper).vm.$emit('click');

    await Vue.nextTick();
    expect(wrapper.vm.finalUrl)
      .toBe(`${BASE_URL}/${INITIAL_WIDTH}/${INITIAL_HEIGHT}/${INITIAL_CATEGORY_VALUE},${FIRST_CATEGORY_VALUE}?dummy=${MOCK_DATE}`);
  });

  it('generates relevant image according to the properties', () => {
    const wrapper = createComponent({
      initialWidth: INITIAL_WIDTH,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 },
    });
    const image = findElemByTestId('relevantImage', wrapper);

    expect(image).toBeTruthy();
  });

  it('does not generate image when one of the props is falsy', () => {
    const wrapper = createComponent({
      initialWidth: 0,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 },
    });
    const image = findElemByTestId('relevantImage', wrapper);

    expect(image.exists()).toBe(false);
  });

  it('does not show image when /showImage/ is false', () => {
    const wrapper = createComponent({
      initialWidth: INITIAL_WIDTH,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 },
    });
    wrapper.vm.showImage = false;
    const image = findElemByTestId('relevantImage', wrapper);

    expect(image.exists()).toBe(false);
  });

  it('does not render refresh btn when /showImage/ is false', () => {
    const wrapper = createComponent({
      initialWidth: INITIAL_WIDTH,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 },
    });
    wrapper.vm.showImage = false;

    expect(findElemByTestId('refreshBtn', wrapper).exists()).toBe(false);
  });

  it('disables refresh btn when finalUrl is falsy', async () => {
    const wrapper = createComponent({
      initialWidth: 0,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 },
    });
    wrapper.vm.showImage = true;
    await Vue.nextTick();
    const btn = findElemByTestId('refreshBtn', wrapper);
    expect(btn.props().disable).toBe(true);
  });

  it('refreshes img`s url when refresh btn is clicked', async () => {
    let wrapper = createComponent({
      initialWidth: INITIAL_WIDTH,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 },
    });
    const initialUrl = wrapper.vm.finalUrl;
    spy.mockRestore();
    wrapper = createComponent({
      initialWidth: INITIAL_WIDTH,
      initialHeight: INITIAL_HEIGHT,
      initialCategory: { value: INITIAL_CATEGORY_VALUE, id: 0 },
    });

    wrapper.vm.showImage = true;
    await Vue.nextTick();

    await findElemByTestId('refreshBtn', wrapper).trigger('click');

    expect(wrapper.vm.finalUrl).not.toBe(initialUrl);
  });
});
