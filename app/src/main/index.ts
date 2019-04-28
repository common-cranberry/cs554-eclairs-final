
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Template from "./index.pug";
import "./index.styl";

@Template
@Component
export default class Main extends Vue {
  public auth: {
    register: boolean;
    success: boolean;
    username: string;
    password: string;
    passmatch: string;
  } = {
    register: true,
    success: false,
    username: "",
    password: "",
    passmatch: ""
  };
}
