/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return,
 @typescript-eslint/no-unsafe-call, no-shadow */
// @ts-nocheck
import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import { QBtn } from 'quasar'; // <= cherry pick only the components you actually use
import AppCounter from 'pages/AppCounter.vue';
import CounterDisplay from 'components/CounterDisplay.vue';
import { stubComponent } from 'app/test/jest/helpers/stubComponent';
import { Vue } from 'vue-property-decorator';

const CounterDisplayStub = stubComponent(CounterDisplay);

describe('AppCounter', () => {
  const createComponent = mountFactory(AppCounter, {
    quasar: {
      components: { QBtn },
    },
    global: {
      stubs: CounterDisplayStub,
    },

  });
  const findElemByTestId = (testId: string | number, wrapper) => wrapper.find(`[data-testid="${testId}"]`);

  it('mounts correctly', () => {
    const wrapper = createComponent();

    expect(wrapper).toBeTruthy();
  });

  it('passes props correctly', async () => {
    const wrapper = createComponent();
    findElemByTestId('increment', wrapper).vm.$emit('click');
    await Vue.nextTick();

    expect(wrapper.findComponent(CounterDisplay).props().clickCount).toBe(1);
  });
  it('increases by 1 when increment button is clicked', async () => {
    const wrapper = createComponent();

    findElemByTestId('increment', wrapper).vm.$emit('click');
    await Vue.nextTick();

    expect(wrapper.findComponent(CounterDisplay).props().clickCount).toBe(1);
  });
  it('decreases by 1 when decrement button is clicked', async () => {
    const wrapper = createComponent();

    findElemByTestId('increment', wrapper).vm.$emit('click');
    findElemByTestId('increment', wrapper).vm.$emit('click');

    findElemByTestId('decrement', wrapper).vm.$emit('click');
    await Vue.nextTick();

    expect(wrapper.findComponent(CounterDisplay).props().clickCount).toBe(1);
  });

  it('disables decrease btn when counter equals zero', () => {
    const wrapper = createComponent();
    expect(findElemByTestId('decrement', wrapper).props().disable).toBe(true);
  });
});
