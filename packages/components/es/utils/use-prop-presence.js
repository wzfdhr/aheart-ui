import { getCurrentInstance, ref, onBeforeUpdate, readonly } from "vue";
const usePropPresence = (...names) => {
  const instance = getCurrentInstance();
  const readPresence = () => {
    const vnodeProps = (instance == null ? void 0 : instance.vnode.props) ?? {};
    return names.some((name) => Object.prototype.hasOwnProperty.call(vnodeProps, name));
  };
  const present = ref(readPresence());
  onBeforeUpdate(() => {
    present.value = readPresence();
  });
  return readonly(present);
};
export {
  usePropPresence
};
