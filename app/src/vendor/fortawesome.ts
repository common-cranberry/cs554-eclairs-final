
import Vue from "vue";

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
import {
  library
} from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare
} from "@fortawesome/free-regular-svg-icons";

for (const icon of [
  faCheckSquare, faChevronLeft, faChevronRight, faSquare
]) {
  library.add(icon as any);
}

Vue.component("font-awesome-icon", <any> FontAwesomeIcon);
Vue.component("font-awesome-layers", <any> FontAwesomeLayers);
Vue.component("font-awesome-layers-text", <any> FontAwesomeLayersText);
