
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Template from "./index.pug";
import "./index.styl";

@Template
@Component
export default class Home extends Vue {
  public message: string = "Hello World";
}
