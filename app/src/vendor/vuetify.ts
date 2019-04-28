
import Vue from "vue";
import Vuetify from "vuetify";
import "./vuetify.styl";

export const theme: {
  [key: string]: string;
} = {
  primary: "#0984e3",
  secondary: "#6c5ce7",
  accent: "#00cec9",
  error: "#d63031",
  warning: "#fdcb6e",
  info: "#00cec9",
  success: "#00b894"
};

Vue.use(Vuetify, {
  theme,
  iconfont: "faSvg"
});
