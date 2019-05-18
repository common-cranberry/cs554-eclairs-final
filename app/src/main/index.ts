
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Template from "./index.pug";
import "./index.styl";

@Template
@Component
export default class Main extends Vue {
  public authValid: boolean = true;

  public get required ( ): ( v: string ) => true | string {
    return ( v ): true | string => !!v || "required";
  }

  public get requiredForRegister ( ): ( v: string ) => true | string {
    return ( v ): true | string => !this.$store.auth.register || !!v || "required";
  }

  public async submit ( ): Promise<any> {
    if ((this.$refs.auth as any).validate()) {
      return this.$store.authorize();
    }
  }
}
