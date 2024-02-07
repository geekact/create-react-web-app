import { defineModel } from 'foca';

const initialState: { counter: number } = {
  counter: 0,
};

/**
 * 使用方法：
 * 导入到react组件文件中即可使用
 *
 * const App: FC = () => {
 *   const { counter } = useModel(counterModel);
 *   const handlePlus = () => {
 *     counterModel.plus(1);
 *   };
 *   return <button onClick={handlePlus}>{counter}</button>;
 * };
 *
 * 更多用法请参考官方文档
 * @link https://foca.js.org
 */
export const counterModel = defineModel('counter', {
  initialState: initialState,
  reducers: {
    plus(state, step: number) {
      state.counter += step;
    },
    minus(state, step: number) {
      state.counter -= step;
    },
  },
});
